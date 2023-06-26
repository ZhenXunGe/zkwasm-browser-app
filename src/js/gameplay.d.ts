/* tslint:disable */
/* eslint-disable */
/**
*/
export function init_rg(): void;
/**
* @returns {number}
*/
export function get_wisdom(): number;
/**
* @returns {number}
*/
export function get_attack(): number;
/**
* @returns {number}
*/
export function get_luck(): number;
/**
* @returns {number}
*/
export function get_charm(): number;
/**
* @returns {number}
*/
export function get_family(): number;
/**
* @returns {number}
*/
export function get_speed(): number;
/**
* @returns {number}
*/
export function get_defence(): number;
/**
* @returns {number}
*/
export function get_age(): number;
/**
* @returns {number}
*/
export function get_currency(): number;
/**
* @returns {number}
*/
export function get_life(): number;
/**
* @param {number} index
* @returns {number}
*/
export function get_choice(index: number): number;
/**
* @returns {number}
*/
export function get_event(): number;
/**
* @returns {Uint32Array}
*/
export function get_inventory(): Uint32Array;
/**
* @param {number} at
*/
export function action(at: number): void;
/**
* @param {number} at
*/
export function choose(at: number): void;
/**
* @param {number} item_id
*/
export function choose_item(item_id: number): void;
/**
* @param {number} item_id
*/
export function sell_item(item_id: number): void;
/**
* @returns {number}
*/
export function get_item_context_length(): number;
/**
* @param {number} index
* @returns {number}
*/
export function get_item_context_at_index(index: number): number;
/**
* @returns {Uint32Array}
*/
export function get_item_context(): Uint32Array;
/**
*/
export function zkmain(): void;
