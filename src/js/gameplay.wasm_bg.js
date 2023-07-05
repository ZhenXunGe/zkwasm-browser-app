let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}

/**
*/
export function init_rg() {
    wasm.init_rg();
}

/**
*/
export function reset_character() {
    wasm.reset_character();
}

/**
* @returns {number}
*/
export function get_current_instance() {
    const ret = wasm.get_current_instance();
    return ret >>> 0;
}

/**
* @param {number} instance
*/
export function update_instance(instance) {
    wasm.update_instance(instance);
}

/**
* @returns {number}
*/
export function get_wisdom() {
    const ret = wasm.get_wisdom();
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function get_attack() {
    const ret = wasm.get_attack();
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function get_luck() {
    const ret = wasm.get_luck();
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function get_charm() {
    const ret = wasm.get_charm();
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function get_family() {
    const ret = wasm.get_family();
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function get_speed() {
    const ret = wasm.get_speed();
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function get_defence() {
    const ret = wasm.get_defence();
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function get_age() {
    const ret = wasm.get_age();
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function get_currency() {
    const ret = wasm.get_currency();
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function get_life() {
    const ret = wasm.get_life();
    return ret >>> 0;
}

/**
* @param {number} index
* @returns {number}
*/
export function get_choice(index) {
    const ret = wasm.get_choice(index);
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function get_event() {
    const ret = wasm.get_event();
    return ret >>> 0;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len);
}
/**
* @returns {Uint32Array}
*/
export function get_inventory() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_inventory(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayU32FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 4);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} at
*/
export function action(at) {
    wasm.action(at);
}

/**
* @param {number} at
*/
export function choose(at) {
    wasm.choose(at);
}

/**
* @param {number} item_id
*/
export function choose_item(item_id) {
    wasm.choose_item(item_id);
}

/**
* @param {number} item_id
*/
export function sell_item(item_id) {
    wasm.sell_item(item_id);
}

/**
* @param {number} item_id
*/
export function use_item(item_id) {
    wasm.use_item(item_id);
}

/**
* @param {number} item_id
*/
export function stop_use_item(item_id) {
    wasm.stop_use_item(item_id);
}

/**
* @param {number} item_id
* @returns {number}
*/
export function get_active_item_level(item_id) {
    const ret = wasm.get_active_item_level(item_id);
    return ret >>> 0;
}

/**
* @param {number} item_id
* @returns {number}
*/
export function get_inventory_item_level(item_id) {
    const ret = wasm.get_inventory_item_level(item_id);
    return ret >>> 0;
}

/**
* @returns {Uint32Array}
*/
export function get_active_items() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_active_items(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayU32FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 4);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @returns {number}
*/
export function get_item_context_length() {
    const ret = wasm.get_item_context_length();
    return ret >>> 0;
}

/**
* @param {number} index
* @returns {number}
*/
export function get_item_context_at_index(index) {
    const ret = wasm.get_item_context_at_index(index);
    return ret >>> 0;
}

/**
* @returns {Uint32Array}
*/
export function get_item_context() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_item_context(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayU32FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 4);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
*/
export function zkmain() {
    wasm.zkmain();
}

