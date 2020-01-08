import React, { useState, useEffect, useRef } from "react";
import * as Contacts from "expo-contacts";
import * as Permissions from "expo-permissions";
import Fuse from "fuse.js";
import emitter from "tiny-emitter/instance";
import sh from "shorthash";
import api from "./API";

export async function getContacts() {
  const { status } = await Permissions.askAsync(Permissions.CONTACTS);
  if (status !== "granted") {
    return [];
  }

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers]
  });

  if (!data.length) {
    return [];
  }

  const contacts = data
    .reduce((contacts, item) => {
      const hasUSNumber =
        item.phoneNumbers &&
        item.phoneNumbers.length &&
        item.phoneNumbers[0] &&
        item.phoneNumbers[0].countryCode === "us";

      if (hasUSNumber) {
        const number = item.phoneNumbers[0].digits.substr(-10);
        contacts.push({
          number,
          id: sh.unique(number),
          name: item.name
        });
      }

      return contacts;
    }, [])
    .sort((a, b) => {
      const aSplit = a.name.split(" ");
      const aLast = aSplit[aSplit.length - 1].toLowerCase();
      const bSplit = b.name.split(" ");
      const bLast = bSplit[bSplit.length - 1].toLowerCase();
      if (aLast < bLast) {
        return -1;
      }
      if (aLast > bLast) {
        return 1;
      }
      return 0;
    });

  try {
    await api("user/contacts", {
      contacts
    });
  } catch (error) {
    console.log(error.stack);
  }

  return contacts;
}

export const LOAD_CONTACTS = "load-contacts";
export const UNLOAD_CONTACTS = "unload-contacts";

export function useContacts() {
  const contactList = useRef([]);
  const fuseRef = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const onLoadContacts = async () => {
      try {
        contactList.current = await getContacts();

        setContacts(contactList.current);

        if (!contactList.current.length) {
          fuseRef.current = null;
          return;
        }

        fuseRef.current = new Fuse(contactList.current, {
          caseSensitive: false,
          shouldSort: true,
          findAllMatches: false,
          includeMatches: true,
          threshold: 0.3,
          distance: 20,
          keys: ["name"]
        });
      } catch (error) {
        console.log(error);
      }
    };

    const onUnloadContacts = () => {
      contactList.current = [];
      setContacts(contactList.current);
      fuseRef.current = null;
    };

    emitter.on(LOAD_CONTACTS, onLoadContacts);
    emitter.on(UNLOAD_CONTACTS, onUnloadContacts);

    return () => {
      emitter.off(LOAD_CONTACTS, onLoadContacts);
      emitter.off(UNLOAD_CONTACTS, onUnloadContacts);
    };
  }, []);

  useEffect(() => {
    if (!filter || !filter.length) {
      setContacts(contactList.current);
    } else if (fuseRef.current) {
      setContacts(fuseRef.current.search(filter));
    }
  }, [filter]);

  return [contacts, filter, setFilter];
}
