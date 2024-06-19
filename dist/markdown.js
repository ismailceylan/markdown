var d = Object.defineProperty;
var g = (i, t, e) => t in i ? d(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var o = (i, t, e) => g(i, typeof t != "symbol" ? t + "" : t, e);
class u {
  constructor(t) {
    o(this, "cursor", 0);
    o(this, "stream", null);
    o(this, "stack", []);
    this.stream = t, this.cursor = t.cursor;
  }
  positiveLookAhead(t) {
    return this.stack.push(
      t === this.stream.raw.slice(this.cursor, this.cursor + t.length)
    ), this.cursor += t.length, this;
  }
  negativeLookAhead(t) {
    return this.stack.push(
      t !== this.stream.raw.slice(this.cursor, this.cursor + t.length)
    ), this.cursor += t.length, this;
  }
  negativeLookBehind(t) {
    return this.stack.push(
      t !== this.stream.raw.slice(this.cursor - t.length, this.cursor)
    ), this.cursor -= t.length, this;
  }
  /**
   * Returns whether all looking around in the stack are truthy or not.
   *
   * @return {boolean}
   */
  get passed() {
    return this.stack.reduce(
      (t, e) => t && e,
      !0
    );
  }
}
class k {
  constructor(t) {
    /**
     * Cursor position in the stream.
     * 
     * @type {number}
     */
    o(this, "cursor", 0);
    this.raw = t;
  }
  /**
   * Indicates the length of the raw string.
   *
   * @type {number}
   */
  get length() {
    return this.raw.length;
  }
  /**
   * Indicates the next byte in the stream.
   *
   * If the cursor has reached the end of the stream, this will be undefined.
   * 
   * @type {string|undefined}
   */
  get next() {
    return this.raw[this.cursor++];
  }
  /**
   * Indicates the current byte in the stream.
   * 
   * If the cursor has reached the end of the stream, this will be undefined.
   *
   * @type {string|undefined}
   */
  get current() {
    return this.raw[this.cursor];
  }
  /**
   * Indicates if the cursor has reached the end of the stream.
   *
   * @type {boolean}
   */
  get end() {
    return this.cursor >= this.length;
  }
  readUntil(t) {
    const e = this.raw.slice(this.cursor), s = e.indexOf(t);
    if (s > -1) {
      const c = e.slice(0, s);
      return this.cursor += c.length, c;
    }
  }
  positiveLookAhead(t) {
    return new u(this).positiveLookAhead(t);
  }
  negativeLookAhead(t) {
    return new u(this).negativeLookAhead(t);
  }
  negativeLookBehind(t) {
    return new u(this).negativeLookBehind(t);
  }
}
class w {
  constructor({ plugins: t = {} } = {}) {
    o(this, "plugins", null);
    o(this, "ast", []);
    this.plugins = t;
  }
  render(t) {
    const e = new k(t);
    let s;
    for (; !e.end; ) {
      let c = e.next;
      for (const n in this.plugins) {
        const a = this.plugins[n];
        for (const r of a)
          if (r.mode == "match") {
            const h = e.negativeLookBehind(r.with.at(0)).passed, l = e.positiveLookAhead(r.with).negativeLookAhead(r.with.at(-1)).passed;
            h && l && (s || (s = /* @__PURE__ */ Object.create(null), s.name = n, s.index = e.cursor + r.with.length + 1), e.cursor += r.with.length);
          } else if (r.mode === "eat" && s) {
            const h = /* @__PURE__ */ Object.create(null);
            h.index = e.cursor + 1, h.value = e.readUntil(r.until), h.end = e.cursor, s[r.name] = h, e.cursor += r.until.length;
          }
        if (s)
          break;
      }
      if (s) {
        const n = /* @__PURE__ */ Object.create(null);
        n.name = "ascii", n.value = c, n.index = e.cursor, this.ast.push(n);
      } else
        s = /* @__PURE__ */ Object.create(null), s.name = "ascii", s.value = c, s.index = e.cursor;
      this.ast.push(s), s = null;
    }
  }
}
export {
  w as default
};
