import _ from "lodash";
import { Calendar, Linking } from "expo";
import { AsyncStorage } from "react-native";
import { grantCalendar } from "./Permissions";
import { DEV, IOS, ANDROID } from "./Constants";
import { makeDuration, createDate, dayToISO } from "./Time";
import { ABBREVIATED_DAYS } from "./Constants";

class CalendarManager {
  constructor() {
    this._calendarName = DEV ? "Buncha-Dev" : "Buncha";
  }

  _calendarName;

  toggleEvent = async ({ _source: item, _id: id }, create) => {
    const calendar = await this._getCalendar();

    if (!calendar) {
      return;
    }

    const itemId = `cal${id}`;

    try {
      let existingIds;

      const existingEvents = await AsyncStorage.getItem(itemId);

      if (existingEvents) {
        existingIds = JSON.parse(existingEvents);
      }

      if (existingIds) {
        await Promise.all(
          existingIds.map(id => {
            return Calendar.deleteEventAsync(id, { futureEvents: true });
          })
        );
      }

      if (create) {
        const timesToNotify = _(item.groupedHours)
          .map(group => {
            const isoDays = group.days.map(day => {
              const start = group.start;
              const iso = dayToISO(ABBREVIATED_DAYS.indexOf(day.text));
              const startDate = createDate(start, iso);
              const duration = makeDuration(group);
              const endDate = startDate.clone().add(duration, "h");
              return {
                startDate: startDate.toDate(),
                endDate: endDate.toDate()
              };
            });

            return isoDays;
          })
          .flatten()
          .value();

        const createdIds = await Promise.all(
          timesToNotify.map(times => {
            const details = {
              ...times,
              title: item.title,
              notes: item.description,
              location: `${item.location}\n${item.address}`,
              availability: Calendar.Availability.FREE,
              timeZone: `${times.startDate.getTimezoneOffset()}`,
              recurrenceRule: {
                frequency: Calendar.Frequency.WEEKLY
              }
            };

            const url = Linking.makeUrl(`e/${id}`);

            if (IOS) {
              details.url = url;
            } else if (ANDROID) {
              details.notes += `\n${url}`;
            }

            return Calendar.createEventAsync(calendar.id, details);
          })
        );

        await AsyncStorage.setItem(itemId, JSON.stringify(createdIds));
      }
    } catch (error) {
      console.log(error);
    }
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

      return cal;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}

export default new CalendarManager();
