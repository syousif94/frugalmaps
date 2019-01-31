import { Calendar, Permissions } from "expo";
import { grantCalendar } from "./Permissions";
import { DEV, IOS, ANDROID } from "./Constants";

class CalendarManager {
  constructor() {
    this._calendarName = DEV ? "Buncha-Dev" : "Buncha";
    this._calendar = this._getCalendar();
  }

  _calendarName;

  _calendar;

  toggleEvent = async (event, create) => {
    const calendar = await this._calendar;

    if (!calendar) {
      return;
    }

    console.log({
      event,
      calendar,
      create
    });
  };

  _getCalendar = async () => {
    try {
      await grantCalendar();

      let calendars = await Calendar.getCalendarsAsync();

      let cal = calendars.find(cal => cal.title === this._calendarName);

      if (!cal) {
        const details = {
          title: this._calendarName,
          color: "#FF94CD"
        };

        if (IOS) {
          const sources = await Calendar.getSourcesAsync();
          const source = sources.find(
            s => s.name === "iCloud" || s.name === "On My iPhone"
          );
          const sourceId = source && source.id;
          if (!sourceId) {
            throw new Error("Invalid calendar sources");
          }
          details.sourceId = sourceId;
          details.entityType = Calendar.EntityTypes.EVENT;
        } else if (ANDROID) {
          details.source = {
            isLocalAccount: true,
            name: "buncha"
          };
          details.name = this._calendarName;
          details.ownerAccount = "buncha";
        }

        const id = await Calendar.createCalendarAsync(details);

        calendars = await Calendar.getCalendarsAsync();
        cal = calendars.find(cal => cal.id === id);
      }

      if (!cal) {
        throw new Error("Unable to create calendar");
      }

      console.log({ calendars, cal });

      return cal;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}

export default new CalendarManager();
