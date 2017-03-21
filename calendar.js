/**
 * Google Calendar API
 */

/* globals gapi */

const m = require('mithril');

function loadApi() {
  return gapi.client.load('calendar', 'v3');
}

/**
 * 非同期関数
 * Google カレンダーからイベントのリストを取得する
 *
 * params: Object
 * params.calendarId: string(デフォルトは'primary')
 * params.timeMin: ISOString(デフォルトは(new Date()).toISOString()
 */
function getCalendarEvents(params={}) {
  if (gapi.client.calendar) {
    return _getCalendarEvents(params);
  } else {
    return loadApi().then(() => {
      return _getCalendarEvents(params);
    });
  }
}

function _getCalendarEvents(params={}) {
  const deferred = m.deferred();
  gapi.client.calendar.events.list({
    calendarId: params.calendarId || 'primary',
    timeMin: params.timeMin || (new Date(Date.now() - 60 * 60 * 24 * 7 * 1000)).toISOString(),
    timeMax: params.timeMax || (new Date(Date.now() + 60 * 60 * 24 * 365 * 1000)).toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 100,
    orderBy: 'startTime'
  }).execute(resp => {
    if (resp.error) {
      deferred.reject(resp);
    } else {
      deferred.resolve(resp.items);
    }
  });
  return deferred.promise;
}

/**
 * 非同期関数
 * Google カレンダーのイベントを1つ更新する
 *
 * @param {Event} event
 */
function deleteCalendarEvent(event) {
  const deferred = m.deferred();

  gapi.client.calendar.events.delete({
    calendarId: event.calendarId,
    eventId: event.id,
  }).execute(() => {
    deferred.resolve();
  });
  return deferred.promise;
}

function deleteCalendarEvents(events) {
  return m.sync(events.map(e => {
    return deleteCalendarEvent(e);
  }));
}

/**
 * 非同期関数
 * Google カレンダーのイベントを1つ更新する
 *
 * @param {Event} params.event
 */
function patchCalendarEvent(event) {
  const deferred = m.deferred();

  gapi.client.calendar.events.patch({
    calendarId: event.calendarId,
    eventId: event.id,
    resource: event
  }).execute(() => {
    deferred.resolve();
  });
  return deferred.promise;
}

/**
 * 非同期関数
 * Google カレンダーの複数のイベントを更新する
 *
 * @param {Event[]} events
 */
function patchCalendarEvents(events) {
  return m.sync(events.map(e => {
    return patchCalendarEvent(e);
  }));
}


/**
 * 非同期関数
 * Google カレンダーのイベントを1つ更新する
 *
 * @param {Event} params.event
 */
function updateCalendarEvent(event) {
  const deferred = m.deferred();

  gapi.client.calendar.events.update({
    calendarId: event.calendarId,
    eventId: event.id,
    resource: event
  }).execute(() => {
    deferred.resolve();
  });
  return deferred.promise;
}

/**
 * 非同期関数
 * Google カレンダーの複数のイベントを更新する
 *
 * @param {Event[]} events
 */
function updateCalendarEvents(events) {
  return m.sync(events.map(e => {
    return updateCalendarEvent(e);
  }));
}

/**
 * 非同期関数
 * Google カレンダーにイベントを1つ作成する
 *
 * @param {Event} params.event
 */
function makeCalendarEvent(event) {
  const deferred = m.deferred();

  gapi.client.calendar.events.insert({
    calendarId: event.calendarId,
    resource: event
  }).execute(event => {
    deferred.resolve(event);
  });
  return deferred.promise;
}

/**
 * 非同期関数
 * Google カレンダーに複数のイベントを作成する
 *
 * @param {Event[]} events
 *
 */
function makeCalendarEvents(events) {
  return m.sync(events.map(e => {
    return makeCalendarEvent(e);
  }));
}

module.exports = {
  deleteCalendarEvents,
  getCalendarEvents,
  loadApi,
  makeCalendarEvents,
  patchCalendarEvents,
  updateCalendarEvents,
  makeCalendarEvent,
  patchCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
};
