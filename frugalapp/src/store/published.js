import { combineReducers } from "redux";
import { createSelector } from "reselect";

import { createActions } from "./lib";

const mutations = ["set"];

export const { actions, types } = createActions(mutations, "published");

function refreshing(state = false, { type, payload }) {}

function list(state = [], { type, payload }) {}
