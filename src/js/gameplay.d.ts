/* tslint:disable */
/* eslint-disable */
/**
*/
export function init_rg(): void;
/**
*/
export function reset_character(): void;
/**
* @returns {number}
*/
export function get_current_instance(): number;
/**
* @param {number} instance
*/
export function update_instance(instance: number): void;
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
* @param {number} action
*/
export function action(action: number): void;
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
* @param {number} item_id
*/
export function use_item(item_id: number): void;
/**
* @param {number} item_id
*/
export function stop_use_item(item_id: number): void;
/**
* @param {number} item_id
* @returns {number}
*/
export function get_active_item_level(item_id: number): number;
/**
* @param {number} item_id
* @returns {number}
*/
export function get_inventory_item_level(item_id: number): number;
/**
* @returns {Uint32Array}
*/
export function get_active_items(): Uint32Array;
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
/**
* @param {any} context
* @param {bigint} size
*/
export function sha256_new(context: any, size: bigint): void;
/**
* @param {any} context
* @param {bigint} message
*/
export function sha256_push(context: any, message: bigint): void;
/**
* @param {any} context
*/
export function sha256_finalize(context: any): void;
