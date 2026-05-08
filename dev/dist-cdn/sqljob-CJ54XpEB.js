var Yd = Object.defineProperty;
var zd = (t, e, n) => e in t ? Yd(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var _e = (t, e, n) => zd(t, typeof e != "symbol" ? e + "" : e, n);
import { k as Ss, l as Lr, m as xr, p as Qe, q as Kd, v as vu, w as ni, x as Xd, y as Qd, c as Vt, g as Je, n as hn } from "./sqljob-CUmgjf6H.js";
function Jd(t, e) {
  for (var n = 0; n < e.length; n++) {
    const r = e[n];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const s in r)
        if (s !== "default" && !(s in t)) {
          const i = Object.getOwnPropertyDescriptor(r, s);
          i && Object.defineProperty(t, s, i.get ? i : {
            enumerable: !0,
            get: () => r[s]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }));
}
var Re = function(t) {
  if (t = t || {}, this.Promise = t.Promise || Promise, this.queues = /* @__PURE__ */ Object.create(null), this.domainReentrant = t.domainReentrant || !1, this.domainReentrant) {
    if (typeof process > "u" || typeof process.domain > "u")
      throw new Error(
        "Domain-reentrant locks require `process.domain` to exist. Please flip `opts.domainReentrant = false`, use a NodeJS version that still implements Domain, or install a browser polyfill."
      );
    this.domains = /* @__PURE__ */ Object.create(null);
  }
  this.timeout = t.timeout || Re.DEFAULT_TIMEOUT, this.maxOccupationTime = t.maxOccupationTime || Re.DEFAULT_MAX_OCCUPATION_TIME, this.maxExecutionTime = t.maxExecutionTime || Re.DEFAULT_MAX_EXECUTION_TIME, t.maxPending === 1 / 0 || Number.isInteger(t.maxPending) && t.maxPending >= 0 ? this.maxPending = t.maxPending : this.maxPending = Re.DEFAULT_MAX_PENDING;
};
Re.DEFAULT_TIMEOUT = 0;
Re.DEFAULT_MAX_OCCUPATION_TIME = 0;
Re.DEFAULT_MAX_EXECUTION_TIME = 0;
Re.DEFAULT_MAX_PENDING = 1e3;
Re.prototype.acquire = function(t, e, n, r) {
  if (Array.isArray(t))
    return this._acquireBatch(t, e, n, r);
  if (typeof e != "function")
    throw new Error("You must pass a function to execute");
  var s = null, i = null, o = null;
  typeof n != "function" && (r = n, n = null, o = new this.Promise(function(S, T) {
    s = S, i = T;
  })), r = r || {};
  var a = !1, l = null, u = null, c = null, d = this, h = function(S, T, w) {
    u && (clearTimeout(u), u = null), c && (clearTimeout(c), c = null), S && (d.queues[t] && d.queues[t].length === 0 && delete d.queues[t], d.domainReentrant && delete d.domains[t]), a || (o ? T ? i(T) : s(w) : typeof n == "function" && n(T, w), a = !0), S && d.queues[t] && d.queues[t].length > 0 && d.queues[t].shift()();
  }, f = function(S) {
    if (a)
      return h(S);
    l && (clearTimeout(l), l = null), d.domainReentrant && S && (d.domains[t] = process.domain);
    var T = r.maxExecutionTime || d.maxExecutionTime;
    if (T && (c = setTimeout(function() {
      d.queues[t] && h(S, new Error("Maximum execution time is exceeded " + t));
    }, T)), e.length === 1) {
      var w = !1;
      try {
        e(function(E, v) {
          w || (w = !0, h(S, E, v));
        });
      } catch (E) {
        w || (w = !0, h(S, E));
      }
    } else
      d._promiseTry(function() {
        return e();
      }).then(function(E) {
        h(S, void 0, E);
      }, function(E) {
        h(S, E);
      });
  };
  d.domainReentrant && process.domain && (f = process.domain.bind(f));
  var p = r.maxPending || d.maxPending;
  if (!d.queues[t])
    d.queues[t] = [], f(!0);
  else if (d.domainReentrant && process.domain && process.domain === d.domains[t])
    f(!1);
  else if (d.queues[t].length >= p)
    h(!1, new Error("Too many pending tasks in queue " + t));
  else {
    var g = function() {
      f(!0);
    };
    r.skipQueue ? d.queues[t].unshift(g) : d.queues[t].push(g);
    var _ = r.timeout || d.timeout;
    _ && (l = setTimeout(function() {
      l = null, h(!1, new Error("async-lock timed out in queue " + t));
    }, _));
  }
  var C = r.maxOccupationTime || d.maxOccupationTime;
  if (C && (u = setTimeout(function() {
    d.queues[t] && h(!1, new Error("Maximum occupation time is exceeded in queue " + t));
  }, C)), o)
    return o;
};
Re.prototype._acquireBatch = function(t, e, n, r) {
  typeof n != "function" && (r = n, n = null);
  var s = this, i = function(a, l) {
    return function(u) {
      s.acquire(a, l, u, r);
    };
  }, o = t.reduceRight(function(a, l) {
    return i(l, a);
  }, e);
  if (typeof n == "function")
    o(n);
  else
    return new this.Promise(function(a, l) {
      o.length === 1 ? o(function(u, c) {
        u ? l(u) : a(c);
      }) : a(o());
    });
};
Re.prototype.isBusy = function(t) {
  return t ? !!this.queues[t] : Object.keys(this.queues).length > 0;
};
Re.prototype._promiseTry = function(t) {
  try {
    return this.Promise.resolve(t());
  } catch (e) {
    return this.Promise.reject(e);
  }
};
var Sv = Re;
const _o = Symbol("$$IDENTIFIER_DECORATOR");
function Zd(t) {
  return t && t[_o] === !0;
}
function Cu(t) {
  return typeof t == "function";
}
function Ua(t) {
  return !!(t && typeof t.useClass < "u");
}
function Pa(t) {
  return !!(t && typeof t.useFactory < "u");
}
function ka(t) {
  return !!(t && typeof t.useValue < "u");
}
function qd(t) {
  return !!(t && typeof t.useExisting < "u");
}
function Ba(t) {
  return !!(t && typeof t.useAsync < "u");
}
const Ru = Symbol("AsyncHook");
function ri(t) {
  return !!(t && t.__symbol === Ru);
}
function ye(t) {
  return Cu(t) && !t[_o] ? t.name : t.toString();
}
var Fe = class extends Error {
  constructor(t) {
    super(`[redi]: ${t}`);
  }
};
let Nt = /* @__PURE__ */ function(t) {
  return t.MANY = "many", t.OPTIONAL = "optional", t.REQUIRED = "required", t;
}({}), pn = /* @__PURE__ */ function(t) {
  return t.SELF = "self", t.SKIP_SELF = "skipSelf", t;
}({});
const Ha = Symbol("$$TARGET"), Ti = Symbol("$$DEPENDENCIES");
var th = class extends Fe {
  constructor(t, e) {
    const n = `Could not find dependency registered on the ${t} (indexed) parameter of the constructor of "${ye(e)}".`;
    super(n);
  }
}, eh = class extends Fe {
  constructor(t, e) {
    const n = `It seems that you forgot to provide a parameter to @Required() on the ${e}th parameter of "${ye(t)}"`;
    super(n);
  }
}, nh = class extends Fe {
  constructor(t, e) {
    const n = `It seems that you register "undefined" as dependency on the ${e}th parameter of "${ye(t)}". Please make sure that there is not cyclic dependency among your TypeScript files, or consider using "forwardRef". For more info please visit our website https://redi.wendell.fun/docs/faq#could-not-find-dependency-registered-on`;
    super(n);
  }
};
function bu(t) {
  return t[Ti] || [];
}
function yo(t, e) {
  const r = bu(t).find((s) => s.paramIndex === e);
  if (!r) throw new th(e, t);
  return r;
}
function Ps(t, e, n, r = Nt.REQUIRED, s) {
  const i = {
    paramIndex: n,
    identifier: e,
    quantity: r,
    lookUp: s,
    withNew: !1
  };
  if (typeof e > "u") throw new nh(t, n);
  const o = t;
  o[Ha] === o ? o[Ti].push(i) : (o[Ti] = [i], o[Ha] = o);
}
const ja = /* @__PURE__ */ new Set(), $a = /* @__PURE__ */ new Map();
function me(t) {
  if (ja.has(t))
    return console.error(`Identifier "${t}" already exists. Returning the cached identifier decorator.`), $a.get(t);
  const e = function(n, r, s) {
    Ps(n, e, s);
  };
  return e.decoratorName = t, e.toString = () => e.decoratorName, e[_o] = !0, ja.add(t), $a.set(t, e), e;
}
function rh(t, e, n) {
  const r = yo(t, e);
  r.lookUp = n;
}
function Iu(t) {
  return function e() {
    return this instanceof e ? this : function(n, r, s) {
      rh(n, s, t);
    };
  };
}
const sh = Iu(pn.SKIP_SELF), ih = Iu(pn.SELF);
function oh(t) {
  return t === Nt.OPTIONAL ? "0 or 1" : "1";
}
var _s = class extends Fe {
  constructor(t, e, n) {
    let r = `Expect ${oh(e)} dependency item(s) for id "${ye(t)}" but get ${n}.`;
    n === 0 && (r += " Did you forget to register it?"), n > 1 && (r += " You register it more than once."), super(r), this.quantity = e, this.actual = n;
  }
};
function Tu(t, e, n) {
  if (e === Nt.OPTIONAL && n > 1 || e === Nt.REQUIRED && n !== 1) throw new _s(t, e, n);
}
function ah(t, e) {
  return t === Nt.MANY ? e : e[0];
}
function lh(t, e, n) {
  const r = yo(t, e);
  r.quantity = n;
}
function Eo(t) {
  return function e(n) {
    return this instanceof e ? this : function(r, s, i) {
      if (n) Ps(r, n, i, t);
      else {
        if (t === Nt.REQUIRED) throw new eh(r, i);
        lh(r, i, t);
      }
    };
  };
}
const uh = Eo(Nt.MANY), ch = Eo(Nt.OPTIONAL), Le = Eo(Nt.REQUIRED);
function Su(t, e = 0) {
  return t ? t.map((n, r) => {
    if (r += e, !Array.isArray(n)) return {
      paramIndex: r,
      identifier: n,
      quantity: Nt.REQUIRED,
      withNew: !1
    };
    const s = n.slice(0, n.length - 1), i = n[n.length - 1];
    let o, a = Nt.REQUIRED, l = !1;
    return s.forEach((u) => {
      u instanceof ih ? o = pn.SELF : u instanceof sh ? o = pn.SKIP_SELF : u instanceof ch ? a = Nt.OPTIONAL : u instanceof uh ? a = Nt.MANY : l = !0;
    }), {
      paramIndex: r,
      identifier: i,
      quantity: a,
      lookUp: o,
      withNew: l
    };
  }) : [];
}
function wv(t, e, n = 0) {
  Su(e, n).forEach((s) => {
    Ps(t, s.identifier, s.paramIndex, s.quantity, s.lookUp);
  });
}
function Ov(t) {
  return { unwrap: t };
}
function dh(t) {
  return !!t && typeof t.unwrap == "function";
}
function hh(t) {
  return dh(t) ? t.unwrap() : t;
}
function fh(t, e, n) {
  const r = yo(t, e);
  r.withNew = n;
}
function ph(t) {
  return function e() {
    return this instanceof e ? this : function(n, r, s) {
      fh(n, s, t);
    };
  };
}
const Av = ph(!0);
function gh(t) {
  return !!t && typeof t.dispose == "function";
}
function mh(t) {
  return t.length === 1;
}
const ks = [];
function Wa(t) {
  ks.push(t);
}
function Va() {
  ks.pop();
}
function _h() {
  ks.length = 0;
}
var Ga = class extends Fe {
  constructor(t, e, n) {
    const r = `Cannot find "${ye(e)}" registered by any injector. It is the ${n}th param of "${Zd(t) ? ye(t) : t.name}".`;
    super(r);
  }
}, ys = class extends Fe {
  constructor(t) {
    const e = `Cannot find "${ye(t)}" registered by any injector. The stack of dependencies is: "${ks.map((n) => ye(n)).join(" -> ")}".`;
    super(e), _h();
  }
}, yh = class {
  constructor(t) {
    _e(this, "dependencyMap", /* @__PURE__ */ new Map());
    this.normalizeDependencies(t).map((e) => this.add(e[0], e[1]));
  }
  add(t, e) {
    typeof e > "u" && (e = {
      useClass: t,
      lazy: !1
    });
    let n = this.dependencyMap.get(t);
    typeof n > "u" && (n = [], this.dependencyMap.set(t, n)), n.push(e);
  }
  delete(t) {
    this.dependencyMap.delete(t);
  }
  get(t, e) {
    const n = this.dependencyMap.get(t);
    return Tu(t, e, n.length), ah(e, n);
  }
  has(t) {
    return this.dependencyMap.has(t);
  }
  dispose() {
    this.dependencyMap.clear();
  }
  /**
  * normalize dependencies to `DependencyItem`
  */
  normalizeDependencies(t) {
    return t.map((e) => {
      const n = e[0];
      let r;
      return mh(e) ? r = {
        useClass: e[0],
        lazy: !1
      } : r = e[1], [n, r];
    });
  }
}, Eh = class {
  constructor() {
    _e(this, "resolvedDependencies", /* @__PURE__ */ new Map());
  }
  add(t, e) {
    let n = this.resolvedDependencies.get(t);
    typeof n > "u" && (n = [], this.resolvedDependencies.set(t, n)), n.push(e);
  }
  has(t) {
    return this.resolvedDependencies.has(t);
  }
  get(t, e) {
    const n = this.resolvedDependencies.get(t);
    if (!n) throw new ys(t);
    return Tu(t, e, n.length), e === Nt.MANY ? n : n[0];
  }
  dispose() {
    Array.from(this.resolvedDependencies.values()).forEach((t) => {
      t.forEach((e) => gh(e) ? e.dispose() : void 0);
    }), this.resolvedDependencies.clear();
  }
};
let Si;
(function() {
  /* istanbul ignore next -- @preserve */
  if (typeof requestIdleCallback < "u" && typeof cancelIdleCallback < "u") Si = (t, e) => {
    const n = requestIdleCallback(t, typeof e == "number" ? { timeout: e } : void 0);
    let r = !1;
    return () => {
      r || (r = !0, cancelIdleCallback(n));
    };
  };
  else {
    const t = Object.freeze({
      didTimeout: !0,
      timeRemaining() {
        return 15;
      }
    });
    Si = (e) => {
      const n = setTimeout(() => e(t));
      let r = !1;
      return () => {
        r || (r = !0, clearTimeout(n));
      };
    };
  }
})();
var vh = class {
  constructor(t) {
    _e(this, "executor");
    _e(this, "disposeIdleCallback");
    _e(this, "didRun", !1);
    _e(this, "value");
    _e(this, "error");
    this.executor = () => {
      try {
        this.value = t();
      } catch (e) {
        this.error = e;
      } finally {
        this.didRun = !0;
      }
    }, this.disposeIdleCallback = Si(() => this.executor());
  }
  hasRun() {
    return this.didRun;
  }
  dispose() {
    this.disposeIdleCallback();
  }
  getValue() {
    if (this.didRun || (this.disposeIdleCallback(), this.executor()), this.error) throw this.error;
    return this.value;
  }
};
const Ch = 300, Gr = Symbol("$$NOT_INSTANTIATED_SYMBOL");
var Rh = class extends Fe {
  constructor(t) {
    super(`Detecting cyclic dependency. The last identifier is "${ye(t)}".`);
  }
}, bh = class extends Fe {
  constructor() {
    super("Injector cannot be accessed after it was disposed.");
  }
}, Ih = class extends Fe {
  constructor(t) {
    super(`Async item "${ye(t)}" returns another async item.`);
  }
}, Th = class extends Fe {
  constructor(t) {
    super(`Cannot get async item "${ye(t)}" from sync api.`);
  }
}, Ya = class extends Fe {
  constructor(t) {
    super(`Cannot add dependency "${ye(t)}" after it is already resolved.`);
  }
}, Sh = class extends Fe {
  constructor(t) {
    super(`Cannot delete dependency "${ye(t)}" when it is already resolved.`);
  }
}, Nn = class wi {
  /**
  * Create a new `Injector` instance.
  *
  * @param dependencies - An array of dependencies to register with this injector.
  *   Each dependency can be:
  *   - `[ClassName]` - Register a class as its own identifier
  *   - `[Identifier, DependencyItem]` - Register with a specific identifier and configuration
  * @param parent - Optional parent injector for hierarchical injection.
  *   Child injectors inherit dependencies from their parent.
  *
  * @example
  * ```typescript
  * // Root injector
  * const rootInjector = new Injector([
  *   [AuthService],
  *   [ILogger, { useClass: ConsoleLogger }],
  * ]);
  *
  * // Child injector with parent
  * const childInjector = new Injector(
  *   [[ICache, { useClass: MemoryCache }]],
  *   rootInjector
  * );
  * ```
  */
  constructor(e, n = null) {
    _e(this, "dependencyCollection");
    _e(this, "resolvedDependencyCollection");
    _e(this, "children", []);
    _e(this, "resolutionOngoing", 0);
    _e(this, "disposingCallbacks", /* @__PURE__ */ new Set());
    _e(this, "disposed", !1);
    this.parent = n, this.dependencyCollection = new yh(e || []), this.resolvedDependencyCollection = new Eh(), n && n.children.push(this);
  }
  /**
  * Register a callback to be called when this injector is disposed.
  *
  * Use this to perform cleanup tasks or release external resources
  * when the injector lifecycle ends.
  *
  * **Note:** When your callback is invoked, the injector is already disposed
  * and you cannot interact with it anymore.
  *
  * @param callback - The function to call when the injector is disposed.
  * @returns A disposable that removes the callback when disposed.
  *
  * @example
  * ```typescript
  * const cleanup = injector.onDispose(() => {
  *   console.log('Injector disposed, cleaning up...');
  * });
  *
  * // Later, remove the callback if no longer needed
  * cleanup.dispose();
  * ```
  */
  onDispose(e) {
    return this.disposingCallbacks.add(e), { dispose: () => this.disposingCallbacks.delete(e) };
  }
  /**
  * Create a child injector that inherits from this injector.
  *
  * The child injector can:
  * - Access all dependencies registered in parent injectors
  * - Override parent dependencies with its own registrations
  * - Have its own scoped dependencies
  *
  * When the parent injector is disposed, all child injectors are disposed first.
  *
  * @param dependencies - Dependencies to register with the child injector.
  * @returns The newly created child injector.
  *
  * @example
  * ```typescript
  * const rootInjector = new Injector([[ILogger, { useClass: ConsoleLogger }]]);
  *
  * const requestInjector = rootInjector.createChild([
  *   [RequestContext, { useClass: RequestContext }],
  * ]);
  *
  * // requestInjector can access both RequestContext and ILogger
  * ```
  */
  createChild(e) {
    return this._ensureInjectorNotDisposed(), new wi(e, this);
  }
  /**
  * Dispose the injector and release all resources.
  *
  * This method:
  * 1. Recursively disposes all child injectors first
  * 2. Calls `dispose()` on all instantiated dependencies that implement `IDisposable`
  * 3. Clears all internal collections
  * 4. Detaches from parent injector
  * 5. Invokes all registered `onDispose` callbacks
  *
  * After disposal, the injector cannot be used anymore.
  *
  * @example
  * ```typescript
  * const injector = new Injector([[DatabaseService]]);
  * const db = injector.get(DatabaseService);
  *
  * // When done with the injector
  * injector.dispose(); // DatabaseService.dispose() is called automatically
  * ```
  */
  dispose() {
    this.children.forEach((e) => e.dispose()), this.children.length = 0, this.dependencyCollection.dispose(), this.resolvedDependencyCollection.dispose(), this.deleteSelfFromParent(), this.disposed = !0, this.disposingCallbacks.forEach((e) => e()), this.disposingCallbacks.clear();
  }
  deleteSelfFromParent() {
    if (this.parent) {
      const e = this.parent.children.indexOf(this);
      this.parent.children.splice(e, 1);
    }
  }
  /**
  * Add a dependency or pre-created instance to the injector at runtime.
  *
  * This allows dynamic registration of dependencies after the injector is created.
  * Throws an error if the dependency has already been instantiated.
  *
  * @param dependency - A tuple containing:
  *   - `[Ctor]` - A class to register as its own identifier
  *   - `[Identifier, DependencyItem]` - An identifier with its configuration
  *   - `[Identifier, Instance]` - An identifier with a pre-created instance
  *
  * @throws {AddDependencyAfterResolutionError} If the dependency is already resolved.
  *
  * @example
  * ```typescript
  * const injector = new Injector();
  *
  * // Add a class
  * injector.add([MyService]);
  *
  * // Add with configuration
  * injector.add([ILogger, { useClass: ConsoleLogger }]);
  *
  * // Add a pre-created instance
  * const config = { apiUrl: 'https://api.example.com' };
  * injector.add([IConfig, config]);
  * ```
  */
  add(e) {
    this._ensureInjectorNotDisposed();
    const n = e[0], r = e[1];
    if (this.resolvedDependencyCollection.has(n)) throw new Ya(n);
    typeof r > "u" ? this.dependencyCollection.add(n) : Ba(r) || Ua(r) || ka(r) || Pa(r) ? this.dependencyCollection.add(n, r) : this.resolvedDependencyCollection.add(n, r);
  }
  /**
  * Replace an existing dependency registration.
  *
  * Use this to swap out an implementation, typically for testing purposes.
  * Throws an error if the dependency has already been instantiated.
  *
  * @param dependency - A tuple of `[Identifier, DependencyItem]` to replace the existing registration.
  *
  * @throws {AddDependencyAfterResolutionError} If the dependency is already resolved.
  *
  * @example
  * ```typescript
  * // In tests, replace a real service with a mock
  * injector.replace([IHttpClient, { useClass: MockHttpClient }]);
  * ```
  */
  replace(e) {
    this._ensureInjectorNotDisposed();
    const n = e[0];
    if (this.resolvedDependencyCollection.has(n)) throw new Ya(n);
    this.dependencyCollection.delete(n), this.dependencyCollection.add(n, e[1]);
  }
  /**
  * Remove a dependency registration from the injector.
  *
  * Throws an error if the dependency has already been instantiated.
  *
  * @param identifier - The identifier of the dependency to remove.
  *
  * @throws {DeleteDependencyAfterResolutionError} If the dependency is already resolved.
  *
  * @example
  * ```typescript
  * injector.delete(ITemporaryService);
  * ```
  */
  delete(e) {
    if (this._ensureInjectorNotDisposed(), this.resolvedDependencyCollection.has(e)) throw new Sh(e);
    this.dependencyCollection.delete(e);
  }
  /**
  * Execute a function with controlled access to the injector.
  *
  * The callback receives an `IAccessor` that provides limited access to
  * the injector's `get` and `has` methods. This is useful for service locator
  * patterns or when you need to resolve dependencies dynamically.
  *
  * @param cb - The function to execute. Receives an accessor and any additional arguments.
  * @param args - Additional arguments to pass to the callback.
  * @returns The return value of the callback function.
  *
  * @example
  * ```typescript
  * const result = injector.invoke((accessor, multiplier) => {
  *   const calc = accessor.get(ICalculator);
  *   return calc.compute() * multiplier;
  * }, 2);
  * ```
  */
  invoke(e, ...n) {
    return this._ensureInjectorNotDisposed(), e({
      get: (s, i, o) => this._get(s, i, o),
      has: (s) => this.has(s)
    }, ...n);
  }
  /**
  * Check if a dependency is registered in this injector or any parent injector.
  *
  * @param id - The identifier of the dependency to check.
  * @returns `true` if the dependency is registered, `false` otherwise.
  *
  * @example
  * ```typescript
  * if (injector.has(IOptionalFeature)) {
  *   const feature = injector.get(IOptionalFeature);
  *   feature.enable();
  * }
  * ```
  */
  has(e) {
    var n;
    return this.dependencyCollection.has(e) || ((n = this.parent) == null ? void 0 : n.has(e)) || !1;
  }
  /**
  * Retrieve a dependency instance from the injector.
  *
  * The dependency will be instantiated on first access and cached for subsequent requests.
  * If the dependency is not found and not optional, an error is thrown.
  *
  * @param id - The identifier of the dependency to retrieve.
  * @param quantityOrLookup - Either a {@link Quantity} specifying how many instances to get,
  *   or a {@link LookUp} specifying where to search.
  * @param lookUp - A {@link LookUp} specifying where to search (if first param is Quantity).
  * @returns The dependency instance, an array of instances (for `Quantity.MANY`),
  *   or `null` (for `Quantity.OPTIONAL` when not found).
  *
  * @throws {DependencyNotFoundError} If the dependency is not registered and not optional.
  * @throws {GetAsyncItemFromSyncApiError} If trying to get an async dependency synchronously.
  *
  * @example
  * ```typescript
  * // Get a required dependency
  * const logger = injector.get(ILogger);
  *
  * // Get an optional dependency
  * const cache = injector.get(ICache, Quantity.OPTIONAL);
  *
  * // Get all registered handlers
  * const handlers = injector.get(IHandler, Quantity.MANY);
  *
  * // Only search current injector
  * const localService = injector.get(IService, LookUp.SELF);
  * ```
  */
  get(e, n, r) {
    this._ensureInjectorNotDisposed();
    const s = this._get(e, n, r);
    if (Array.isArray(s) && s.some((i) => ri(i)) || ri(s)) throw new Th(e);
    return s;
  }
  _get(e, n, r, s) {
    let i = Nt.REQUIRED;
    if (n === Nt.REQUIRED || n === Nt.OPTIONAL || n === Nt.MANY ? i = n : r = n, !s) {
      const a = this.getValue(e, i, r);
      if (a !== Gr) return a;
    }
    const o = !s;
    return this.createDependency(e, i, r, o);
  }
  /**
  * Get a dependency in the async way.
  */
  getAsync(e) {
    this._ensureInjectorNotDisposed();
    const n = this.getValue(e, Nt.REQUIRED);
    if (n !== Gr) return Promise.resolve(n);
    const r = this.createDependency(e, Nt.REQUIRED);
    return ri(r) ? r.whenReady() : Promise.resolve(r);
  }
  /**
  * Create an instance of a class with its dependencies injected.
  *
  * Unlike `get()`, the created instance is NOT cached by the injector.
  * Each call creates a new instance. You can also pass custom arguments
  * that will be passed before the injected dependencies.
  *
  * @param ctor - The class constructor to instantiate.
  * @param customArgs - Custom arguments to pass before injected dependencies.
  * @returns A new instance of the class.
  *
  * @example
  * ```typescript
  * class RequestHandler {
  *   constructor(
  *     requestId: string,           // Custom arg
  *     @Inject(ILogger) logger: ILogger  // Injected
  *   ) {}
  * }
  *
  * // Create instance with custom requestId
  * const handler = injector.createInstance(RequestHandler, 'req-123');
  * ```
  */
  createInstance(e, ...n) {
    return this._ensureInjectorNotDisposed(), this._resolveClassImpl({ useClass: e }, ...n);
  }
  _resolveDependency(e, n, r = !0) {
    let s;
    Wa(e);
    try {
      ka(n) ? s = this._resolveValueDependency(e, n) : Pa(n) ? s = this._resolveFactory(e, n, r) : Ua(n) ? s = this._resolveClass(e, n, r) : qd(n) ? s = this._resolveExisting(e, n) : s = this._resolveAsync(e, n), Va();
    } catch (i) {
      throw Va(), i;
    }
    return s;
  }
  _resolveExisting(e, n) {
    const r = this.get(n.useExisting);
    return this.resolvedDependencyCollection.add(e, r), r;
  }
  _resolveValueDependency(e, n) {
    const r = n.useValue;
    return this.resolvedDependencyCollection.add(e, r), r;
  }
  _resolveClass(e, n, r) {
    let s;
    if (n.lazy) {
      const i = new vh(() => (this._ensureInjectorNotDisposed(), this._resolveClassImpl(n)));
      s = new Proxy(/* @__PURE__ */ Object.create(null), {
        get(o, a) {
          if (a in o) return o[a];
          const l = i.getValue();
          let u = l[a];
          return typeof u != "function" || (u = u.bind(l), o[a] = u), u;
        },
        set(o, a, l) {
          return i.getValue()[a] = l, !0;
        }
      });
    } else s = this._resolveClassImpl(n);
    return e && r && this.resolvedDependencyCollection.add(e, s), s;
  }
  _resolveClassImpl(e, ...n) {
    var u;
    const r = e.useClass;
    this.markNewResolution(r);
    const s = bu(r).sort((c, d) => c.paramIndex - d.paramIndex).map((c) => ({
      ...c,
      identifier: hh(c.identifier)
    })), i = [];
    for (const c of s) try {
      const d = this._get(c.identifier, c.quantity, c.lookUp, c.withNew);
      i.push(d);
    } catch (d) {
      throw d instanceof ys || d instanceof _s && d.actual === 0 ? new Ga(r, c.identifier, c.paramIndex) : d;
    }
    let o = [...n];
    const a = s.length > 0 ? s[0].paramIndex : o.length;
    if (o.length !== a) {
      console.warn(`[redi]: Expect ${a} custom parameter(s) of ${ye(r)} but get ${o.length}.`);
      const c = a - o.length;
      c > 0 ? o = [...o, ...Array.from({ length: c }).fill(void 0)] : o = o.slice(0, a);
    }
    const l = new r(...o, ...i);
    return (u = e == null ? void 0 : e.onInstantiation) == null || u.call(e, l), this.markResolutionCompleted(), l;
  }
  _resolveFactory(e, n, r) {
    var a;
    this.markNewResolution(e);
    const s = Su(n.deps), i = [];
    for (const l of s) try {
      const u = this._get(l.identifier, l.quantity, l.lookUp, l.withNew);
      i.push(u);
    } catch (u) {
      throw u instanceof ys || u instanceof _s && u.actual === 0 ? new Ga(e, l.identifier, l.paramIndex) : u;
    }
    const o = n.useFactory.apply(null, i);
    return r && this.resolvedDependencyCollection.add(e, o), this.markResolutionCompleted(), (a = n == null ? void 0 : n.onInstantiation) == null || a.call(n, o), o;
  }
  _resolveAsync(e, n) {
    return {
      __symbol: Ru,
      whenReady: () => this._resolveAsyncImpl(e, n)
    };
  }
  _resolveAsyncImpl(e, n) {
    return n.useAsync().then((r) => {
      const s = this.getValue(e);
      if (s !== Gr) return s;
      let i;
      if (Array.isArray(r)) {
        const o = r[1];
        if (Ba(o)) throw new Ih(e);
        i = this._resolveDependency(e, o);
      } else Cu(r) ? i = this._resolveClassImpl({
        useClass: r,
        onInstantiation: n.onInstantiation
      }) : i = r;
      return this.resolvedDependencyCollection.add(e, i), i;
    });
  }
  getValue(e, n = Nt.REQUIRED, r) {
    const s = () => this.dependencyCollection.has(e) && !this.resolvedDependencyCollection.has(e) ? Gr : this.resolvedDependencyCollection.get(e, n), i = () => {
      if (this.parent) return this.parent.getValue(e, n);
      if (n === Nt.OPTIONAL) return null;
      if (n === Nt.MANY) return [];
      throw new _s(e, Nt.REQUIRED, 0);
    };
    return r === pn.SKIP_SELF ? i() : e === wi ? this : r === pn.SELF || this.resolvedDependencyCollection.has(e) || this.dependencyCollection.has(e) ? s() : i();
  }
  createDependency(e, n, r, s = !0) {
    const i = () => {
      const a = this.dependencyCollection.get(e, n);
      let l = null;
      return Array.isArray(a) ? l = a.map((u) => this._resolveDependency(e, u, s)) : l = this._resolveDependency(e, a, s), l;
    }, o = () => {
      if (this.parent) return this.parent.createDependency(e, n, void 0, s);
      if (n === Nt.OPTIONAL) return null;
      if (n === Nt.MANY) return [];
      throw Wa(e), new ys(e);
    };
    return r === pn.SKIP_SELF ? o() : this.dependencyCollection.has(e) ? i() : o();
  }
  markNewResolution(e) {
    if (this.resolutionOngoing += 1, this.resolutionOngoing >= Ch) throw new Rh(e);
  }
  markResolutionCompleted() {
    this.resolutionOngoing -= 1;
  }
  _ensureInjectorNotDisposed() {
    if (this.disposed) throw new bh();
  }
};
const Nv = function() {
  return function(e, n, r) {
    Ps(e, Nn, r, Nt.REQUIRED, pn.SELF);
  };
}, za = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof global < "u" && global, Ka = "REDI_GLOBAL_LOCK", wh = typeof process < "u" && process.versions != null && process.versions.node != null;
za[Ka] ? wh || console.error(`[redi]: You are loading scripts of redi more than once! This may cause undesired behavior in your application.
Maybe your dependencies added redi as its dependency and bundled redi to its dist files. Or you import different versions of redi.
For more info please visit our website: https://redi.wendell.fun/en-US/docs/faq#import-scripts-of-redi-more-than-once`) : za[Ka] = !0;
var wu = typeof global == "object" && global && global.Object === Object && global, Oh = typeof self == "object" && self && self.Object === Object && self, er = wu || Oh || Function("return this")(), Jn = er.Symbol, Ou = Object.prototype, Ah = Ou.hasOwnProperty, Nh = Ou.toString, dr = Jn ? Jn.toStringTag : void 0;
function Dh(t) {
  var e = Ah.call(t, dr), n = t[dr];
  try {
    t[dr] = void 0;
    var r = !0;
  } catch {
  }
  var s = Nh.call(t);
  return r && (e ? t[dr] = n : delete t[dr]), s;
}
var Mh = Object.prototype, Lh = Mh.toString;
function xh(t) {
  return Lh.call(t);
}
var Fh = "[object Null]", Uh = "[object Undefined]", Xa = Jn ? Jn.toStringTag : void 0;
function $r(t) {
  return t == null ? t === void 0 ? Uh : Fh : Xa && Xa in Object(t) ? Dh(t) : xh(t);
}
function nr(t) {
  return t != null && typeof t == "object";
}
var Ph = "[object Symbol]";
function vo(t) {
  return typeof t == "symbol" || nr(t) && $r(t) == Ph;
}
function kh(t, e) {
  for (var n = -1, r = t == null ? 0 : t.length, s = Array(r); ++n < r; )
    s[n] = e(t[n], n, t);
  return s;
}
var Zn = Array.isArray, Qa = Jn ? Jn.prototype : void 0, Ja = Qa ? Qa.toString : void 0;
function Au(t) {
  if (typeof t == "string")
    return t;
  if (Zn(t))
    return kh(t, Au) + "";
  if (vo(t))
    return Ja ? Ja.call(t) : "";
  var e = t + "";
  return e == "0" && 1 / t == -1 / 0 ? "-0" : e;
}
function Dn(t) {
  var e = typeof t;
  return t != null && (e == "object" || e == "function");
}
function Nu(t) {
  return t;
}
var Bh = "[object AsyncFunction]", Hh = "[object Function]", jh = "[object GeneratorFunction]", $h = "[object Proxy]";
function Co(t) {
  if (!Dn(t))
    return !1;
  var e = $r(t);
  return e == Hh || e == jh || e == Bh || e == $h;
}
var si = er["__core-js_shared__"], Za = function() {
  var t = /[^.]+$/.exec(si && si.keys && si.keys.IE_PROTO || "");
  return t ? "Symbol(src)_1." + t : "";
}();
function Wh(t) {
  return !!Za && Za in t;
}
var Vh = Function.prototype, Gh = Vh.toString;
function Yh(t) {
  if (t != null) {
    try {
      return Gh.call(t);
    } catch {
    }
    try {
      return t + "";
    } catch {
    }
  }
  return "";
}
var zh = /[\\^$.*+?()[\]{}|]/g, Kh = /^\[object .+?Constructor\]$/, Xh = Function.prototype, Qh = Object.prototype, Jh = Xh.toString, Zh = Qh.hasOwnProperty, qh = RegExp(
  "^" + Jh.call(Zh).replace(zh, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function tf(t) {
  if (!Dn(t) || Wh(t))
    return !1;
  var e = Co(t) ? qh : Kh;
  return e.test(Yh(t));
}
function ef(t, e) {
  return t == null ? void 0 : t[e];
}
function Ro(t, e) {
  var n = ef(t, e);
  return tf(n) ? n : void 0;
}
var qa = Object.create, nf = /* @__PURE__ */ function() {
  function t() {
  }
  return function(e) {
    if (!Dn(e))
      return {};
    if (qa)
      return qa(e);
    t.prototype = e;
    var n = new t();
    return t.prototype = void 0, n;
  };
}();
function rf(t, e, n) {
  switch (n.length) {
    case 0:
      return t.call(e);
    case 1:
      return t.call(e, n[0]);
    case 2:
      return t.call(e, n[0], n[1]);
    case 3:
      return t.call(e, n[0], n[1], n[2]);
  }
  return t.apply(e, n);
}
function sf(t, e) {
  var n = -1, r = t.length;
  for (e || (e = Array(r)); ++n < r; )
    e[n] = t[n];
  return e;
}
var of = 800, af = 16, lf = Date.now;
function uf(t) {
  var e = 0, n = 0;
  return function() {
    var r = lf(), s = af - (r - n);
    if (n = r, s > 0) {
      if (++e >= of)
        return arguments[0];
    } else
      e = 0;
    return t.apply(void 0, arguments);
  };
}
function cf(t) {
  return function() {
    return t;
  };
}
var ws = function() {
  try {
    var t = Ro(Object, "defineProperty");
    return t({}, "", {}), t;
  } catch {
  }
}(), df = ws ? function(t, e) {
  return ws(t, "toString", {
    configurable: !0,
    enumerable: !1,
    value: cf(e),
    writable: !0
  });
} : Nu, hf = uf(df), ff = 9007199254740991, pf = /^(?:0|[1-9]\d*)$/;
function Du(t, e) {
  var n = typeof t;
  return e = e ?? ff, !!e && (n == "number" || n != "symbol" && pf.test(t)) && t > -1 && t % 1 == 0 && t < e;
}
function bo(t, e, n) {
  e == "__proto__" && ws ? ws(t, e, {
    configurable: !0,
    enumerable: !0,
    value: n,
    writable: !0
  }) : t[e] = n;
}
function Bs(t, e) {
  return t === e || t !== t && e !== e;
}
var gf = Object.prototype, mf = gf.hasOwnProperty;
function _f(t, e, n) {
  var r = t[e];
  (!(mf.call(t, e) && Bs(r, n)) || n === void 0 && !(e in t)) && bo(t, e, n);
}
function yf(t, e, n, r) {
  var s = !n;
  n || (n = {});
  for (var i = -1, o = e.length; ++i < o; ) {
    var a = e[i], l = void 0;
    l === void 0 && (l = t[a]), s ? bo(n, a, l) : _f(n, a, l);
  }
  return n;
}
var tl = Math.max;
function Ef(t, e, n) {
  return e = tl(e === void 0 ? t.length - 1 : e, 0), function() {
    for (var r = arguments, s = -1, i = tl(r.length - e, 0), o = Array(i); ++s < i; )
      o[s] = r[e + s];
    s = -1;
    for (var a = Array(e + 1); ++s < e; )
      a[s] = r[s];
    return a[e] = n(o), rf(t, this, a);
  };
}
function vf(t, e) {
  return hf(Ef(t, e, Nu), t + "");
}
var Cf = 9007199254740991;
function Mu(t) {
  return typeof t == "number" && t > -1 && t % 1 == 0 && t <= Cf;
}
function Io(t) {
  return t != null && Mu(t.length) && !Co(t);
}
function Rf(t, e, n) {
  if (!Dn(n))
    return !1;
  var r = typeof e;
  return (r == "number" ? Io(n) && Du(e, n.length) : r == "string" && e in n) ? Bs(n[e], t) : !1;
}
function bf(t) {
  return vf(function(e, n) {
    var r = -1, s = n.length, i = s > 1 ? n[s - 1] : void 0, o = s > 2 ? n[2] : void 0;
    for (i = t.length > 3 && typeof i == "function" ? (s--, i) : void 0, o && Rf(n[0], n[1], o) && (i = s < 3 ? void 0 : i, s = 1), e = Object(e); ++r < s; ) {
      var a = n[r];
      a && t(e, a, r, i);
    }
    return e;
  });
}
var If = Object.prototype;
function Lu(t) {
  var e = t && t.constructor, n = typeof e == "function" && e.prototype || If;
  return t === n;
}
function Tf(t, e) {
  for (var n = -1, r = Array(t); ++n < t; )
    r[n] = e(n);
  return r;
}
var Sf = "[object Arguments]";
function el(t) {
  return nr(t) && $r(t) == Sf;
}
var xu = Object.prototype, wf = xu.hasOwnProperty, Of = xu.propertyIsEnumerable, Oi = el(/* @__PURE__ */ function() {
  return arguments;
}()) ? el : function(t) {
  return nr(t) && wf.call(t, "callee") && !Of.call(t, "callee");
};
function Af() {
  return !1;
}
var Fu = typeof exports == "object" && exports && !exports.nodeType && exports, nl = Fu && typeof module == "object" && module && !module.nodeType && module, Nf = nl && nl.exports === Fu, rl = Nf ? er.Buffer : void 0, Df = rl ? rl.isBuffer : void 0, Uu = Df || Af, Mf = "[object Arguments]", Lf = "[object Array]", xf = "[object Boolean]", Ff = "[object Date]", Uf = "[object Error]", Pf = "[object Function]", kf = "[object Map]", Bf = "[object Number]", Hf = "[object Object]", jf = "[object RegExp]", $f = "[object Set]", Wf = "[object String]", Vf = "[object WeakMap]", Gf = "[object ArrayBuffer]", Yf = "[object DataView]", zf = "[object Float32Array]", Kf = "[object Float64Array]", Xf = "[object Int8Array]", Qf = "[object Int16Array]", Jf = "[object Int32Array]", Zf = "[object Uint8Array]", qf = "[object Uint8ClampedArray]", tp = "[object Uint16Array]", ep = "[object Uint32Array]", xt = {};
xt[zf] = xt[Kf] = xt[Xf] = xt[Qf] = xt[Jf] = xt[Zf] = xt[qf] = xt[tp] = xt[ep] = !0;
xt[Mf] = xt[Lf] = xt[Gf] = xt[xf] = xt[Yf] = xt[Ff] = xt[Uf] = xt[Pf] = xt[kf] = xt[Bf] = xt[Hf] = xt[jf] = xt[$f] = xt[Wf] = xt[Vf] = !1;
function np(t) {
  return nr(t) && Mu(t.length) && !!xt[$r(t)];
}
function rp(t) {
  return function(e) {
    return t(e);
  };
}
var Pu = typeof exports == "object" && exports && !exports.nodeType && exports, wr = Pu && typeof module == "object" && module && !module.nodeType && module, sp = wr && wr.exports === Pu, ii = sp && wu.process, sl = function() {
  try {
    var t = wr && wr.require && wr.require("util").types;
    return t || ii && ii.binding && ii.binding("util");
  } catch {
  }
}(), il = sl && sl.isTypedArray, ku = il ? rp(il) : np;
function ip(t, e) {
  var n = Zn(t), r = !n && Oi(t), s = !n && !r && Uu(t), i = !n && !r && !s && ku(t), o = n || r || s || i, a = o ? Tf(t.length, String) : [], l = a.length;
  for (var u in t)
    o && // Safari 9 has enumerable `arguments.length` in strict mode.
    (u == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    s && (u == "offset" || u == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    i && (u == "buffer" || u == "byteLength" || u == "byteOffset") || // Skip index properties.
    Du(u, l)) || a.push(u);
  return a;
}
function op(t, e) {
  return function(n) {
    return t(e(n));
  };
}
function ap(t) {
  var e = [];
  if (t != null)
    for (var n in Object(t))
      e.push(n);
  return e;
}
var lp = Object.prototype, up = lp.hasOwnProperty;
function cp(t) {
  if (!Dn(t))
    return ap(t);
  var e = Lu(t), n = [];
  for (var r in t)
    r == "constructor" && (e || !up.call(t, r)) || n.push(r);
  return n;
}
function Bu(t) {
  return Io(t) ? ip(t) : cp(t);
}
var dp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, hp = /^\w*$/;
function fp(t, e) {
  if (Zn(t))
    return !1;
  var n = typeof t;
  return n == "number" || n == "symbol" || n == "boolean" || t == null || vo(t) ? !0 : hp.test(t) || !dp.test(t) || e != null && t in Object(e);
}
var Fr = Ro(Object, "create");
function pp() {
  this.__data__ = Fr ? Fr(null) : {}, this.size = 0;
}
function gp(t) {
  var e = this.has(t) && delete this.__data__[t];
  return this.size -= e ? 1 : 0, e;
}
var mp = "__lodash_hash_undefined__", _p = Object.prototype, yp = _p.hasOwnProperty;
function Ep(t) {
  var e = this.__data__;
  if (Fr) {
    var n = e[t];
    return n === mp ? void 0 : n;
  }
  return yp.call(e, t) ? e[t] : void 0;
}
var vp = Object.prototype, Cp = vp.hasOwnProperty;
function Rp(t) {
  var e = this.__data__;
  return Fr ? e[t] !== void 0 : Cp.call(e, t);
}
var bp = "__lodash_hash_undefined__";
function Ip(t, e) {
  var n = this.__data__;
  return this.size += this.has(t) ? 0 : 1, n[t] = Fr && e === void 0 ? bp : e, this;
}
function On(t) {
  var e = -1, n = t == null ? 0 : t.length;
  for (this.clear(); ++e < n; ) {
    var r = t[e];
    this.set(r[0], r[1]);
  }
}
On.prototype.clear = pp;
On.prototype.delete = gp;
On.prototype.get = Ep;
On.prototype.has = Rp;
On.prototype.set = Ip;
function Tp() {
  this.__data__ = [], this.size = 0;
}
function Hs(t, e) {
  for (var n = t.length; n--; )
    if (Bs(t[n][0], e))
      return n;
  return -1;
}
var Sp = Array.prototype, wp = Sp.splice;
function Op(t) {
  var e = this.__data__, n = Hs(e, t);
  if (n < 0)
    return !1;
  var r = e.length - 1;
  return n == r ? e.pop() : wp.call(e, n, 1), --this.size, !0;
}
function Ap(t) {
  var e = this.__data__, n = Hs(e, t);
  return n < 0 ? void 0 : e[n][1];
}
function Np(t) {
  return Hs(this.__data__, t) > -1;
}
function Dp(t, e) {
  var n = this.__data__, r = Hs(n, t);
  return r < 0 ? (++this.size, n.push([t, e])) : n[r][1] = e, this;
}
function ln(t) {
  var e = -1, n = t == null ? 0 : t.length;
  for (this.clear(); ++e < n; ) {
    var r = t[e];
    this.set(r[0], r[1]);
  }
}
ln.prototype.clear = Tp;
ln.prototype.delete = Op;
ln.prototype.get = Ap;
ln.prototype.has = Np;
ln.prototype.set = Dp;
var Hu = Ro(er, "Map");
function Mp() {
  this.size = 0, this.__data__ = {
    hash: new On(),
    map: new (Hu || ln)(),
    string: new On()
  };
}
function Lp(t) {
  var e = typeof t;
  return e == "string" || e == "number" || e == "symbol" || e == "boolean" ? t !== "__proto__" : t === null;
}
function js(t, e) {
  var n = t.__data__;
  return Lp(e) ? n[typeof e == "string" ? "string" : "hash"] : n.map;
}
function xp(t) {
  var e = js(this, t).delete(t);
  return this.size -= e ? 1 : 0, e;
}
function Fp(t) {
  return js(this, t).get(t);
}
function Up(t) {
  return js(this, t).has(t);
}
function Pp(t, e) {
  var n = js(this, t), r = n.size;
  return n.set(t, e), this.size += n.size == r ? 0 : 1, this;
}
function yn(t) {
  var e = -1, n = t == null ? 0 : t.length;
  for (this.clear(); ++e < n; ) {
    var r = t[e];
    this.set(r[0], r[1]);
  }
}
yn.prototype.clear = Mp;
yn.prototype.delete = xp;
yn.prototype.get = Fp;
yn.prototype.has = Up;
yn.prototype.set = Pp;
var kp = "Expected a function";
function To(t, e) {
  if (typeof t != "function" || e != null && typeof e != "function")
    throw new TypeError(kp);
  var n = function() {
    var r = arguments, s = e ? e.apply(this, r) : r[0], i = n.cache;
    if (i.has(s))
      return i.get(s);
    var o = t.apply(this, r);
    return n.cache = i.set(s, o) || i, o;
  };
  return n.cache = new (To.Cache || yn)(), n;
}
To.Cache = yn;
var Bp = 500;
function Hp(t) {
  var e = To(t, function(r) {
    return n.size === Bp && n.clear(), r;
  }), n = e.cache;
  return e;
}
var jp = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, $p = /\\(\\)?/g, Wp = Hp(function(t) {
  var e = [];
  return t.charCodeAt(0) === 46 && e.push(""), t.replace(jp, function(n, r, s, i) {
    e.push(s ? i.replace($p, "$1") : r || n);
  }), e;
});
function Vp(t) {
  return t == null ? "" : Au(t);
}
function Gp(t, e) {
  return Zn(t) ? t : fp(t, e) ? [t] : Wp(Vp(t));
}
function Yp(t) {
  if (typeof t == "string" || vo(t))
    return t;
  var e = t + "";
  return e == "0" && 1 / t == -1 / 0 ? "-0" : e;
}
function zp(t, e) {
  e = Gp(e, t);
  for (var n = 0, r = e.length; t != null && n < r; )
    t = t[Yp(e[n++])];
  return n && n == r ? t : void 0;
}
function Kp(t, e, n) {
  var r = t == null ? void 0 : zp(t, e);
  return r === void 0 ? n : r;
}
var ju = op(Object.getPrototypeOf, Object), Xp = "[object Object]", Qp = Function.prototype, Jp = Object.prototype, $u = Qp.toString, Zp = Jp.hasOwnProperty, qp = $u.call(Object);
function tg(t) {
  if (!nr(t) || $r(t) != Xp)
    return !1;
  var e = ju(t);
  if (e === null)
    return !0;
  var n = Zp.call(e, "constructor") && e.constructor;
  return typeof n == "function" && n instanceof n && $u.call(n) == qp;
}
function eg() {
  this.__data__ = new ln(), this.size = 0;
}
function ng(t) {
  var e = this.__data__, n = e.delete(t);
  return this.size = e.size, n;
}
function rg(t) {
  return this.__data__.get(t);
}
function sg(t) {
  return this.__data__.has(t);
}
var ig = 200;
function og(t, e) {
  var n = this.__data__;
  if (n instanceof ln) {
    var r = n.__data__;
    if (!Hu || r.length < ig - 1)
      return r.push([t, e]), this.size = ++n.size, this;
    n = this.__data__ = new yn(r);
  }
  return n.set(t, e), this.size = n.size, this;
}
function rr(t) {
  var e = this.__data__ = new ln(t);
  this.size = e.size;
}
rr.prototype.clear = eg;
rr.prototype.delete = ng;
rr.prototype.get = rg;
rr.prototype.has = sg;
rr.prototype.set = og;
var Wu = typeof exports == "object" && exports && !exports.nodeType && exports, ol = Wu && typeof module == "object" && module && !module.nodeType && module, ag = ol && ol.exports === Wu, al = ag ? er.Buffer : void 0;
al && al.allocUnsafe;
function lg(t, e) {
  return t.slice();
}
var ll = er.Uint8Array;
function ug(t) {
  var e = new t.constructor(t.byteLength);
  return new ll(e).set(new ll(t)), e;
}
function cg(t, e) {
  var n = ug(t.buffer);
  return new t.constructor(n, t.byteOffset, t.length);
}
function dg(t) {
  return typeof t.constructor == "function" && !Lu(t) ? nf(ju(t)) : {};
}
function hg(t) {
  return function(e, n, r) {
    for (var s = -1, i = Object(e), o = r(e), a = o.length; a--; ) {
      var l = o[++s];
      if (n(i[l], l, i) === !1)
        break;
    }
    return e;
  };
}
var fg = hg();
function Ai(t, e, n) {
  (n !== void 0 && !Bs(t[e], n) || n === void 0 && !(e in t)) && bo(t, e, n);
}
function pg(t) {
  return nr(t) && Io(t);
}
function Ni(t, e) {
  if (!(e === "constructor" && typeof t[e] == "function") && e != "__proto__")
    return t[e];
}
function gg(t) {
  return yf(t, Bu(t));
}
function mg(t, e, n, r, s, i, o) {
  var a = Ni(t, n), l = Ni(e, n), u = o.get(l);
  if (u) {
    Ai(t, n, u);
    return;
  }
  var c = i ? i(a, l, n + "", t, e, o) : void 0, d = c === void 0;
  if (d) {
    var h = Zn(l), f = !h && Uu(l), p = !h && !f && ku(l);
    c = l, h || f || p ? Zn(a) ? c = a : pg(a) ? c = sf(a) : f ? (d = !1, c = lg(l)) : p ? (d = !1, c = cg(l)) : c = [] : tg(l) || Oi(l) ? (c = a, Oi(a) ? c = gg(a) : (!Dn(a) || Co(a)) && (c = dg(l))) : d = !1;
  }
  d && (o.set(l, c), s(c, l, r, i, o), o.delete(l)), Ai(t, n, c);
}
function Vu(t, e, n, r, s) {
  t !== e && fg(e, function(i, o) {
    if (s || (s = new rr()), Dn(i))
      mg(t, e, o, n, Vu, r, s);
    else {
      var a = r ? r(Ni(t, o), i, o + "", t, e, s) : void 0;
      a === void 0 && (a = i), Ai(t, o, a);
    }
  }, Bu);
}
var So = bf(function(t, e, n) {
  Vu(t, e, n);
});
function Kt(t) {
  return typeof t == "function";
}
function wo(t) {
  var e = function(r) {
    Error.call(r), r.stack = new Error().stack;
  }, n = t(e);
  return n.prototype = Object.create(Error.prototype), n.prototype.constructor = n, n;
}
var oi = wo(function(t) {
  return function(n) {
    t(this), this.message = n ? n.length + ` errors occurred during unsubscription:
` + n.map(function(r, s) {
      return s + 1 + ") " + r.toString();
    }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = n;
  };
});
function Os(t, e) {
  if (t) {
    var n = t.indexOf(e);
    0 <= n && t.splice(n, 1);
  }
}
var sr = function() {
  function t(e) {
    this.initialTeardown = e, this.closed = !1, this._parentage = null, this._finalizers = null;
  }
  return t.prototype.unsubscribe = function() {
    var e, n, r, s, i;
    if (!this.closed) {
      this.closed = !0;
      var o = this._parentage;
      if (o)
        if (this._parentage = null, Array.isArray(o))
          try {
            for (var a = Ss(o), l = a.next(); !l.done; l = a.next()) {
              var u = l.value;
              u.remove(this);
            }
          } catch (g) {
            e = { error: g };
          } finally {
            try {
              l && !l.done && (n = a.return) && n.call(a);
            } finally {
              if (e) throw e.error;
            }
          }
        else
          o.remove(this);
      var c = this.initialTeardown;
      if (Kt(c))
        try {
          c();
        } catch (g) {
          i = g instanceof oi ? g.errors : [g];
        }
      var d = this._finalizers;
      if (d) {
        this._finalizers = null;
        try {
          for (var h = Ss(d), f = h.next(); !f.done; f = h.next()) {
            var p = f.value;
            try {
              ul(p);
            } catch (g) {
              i = i ?? [], g instanceof oi ? i = Lr(Lr([], xr(i)), xr(g.errors)) : i.push(g);
            }
          }
        } catch (g) {
          r = { error: g };
        } finally {
          try {
            f && !f.done && (s = h.return) && s.call(h);
          } finally {
            if (r) throw r.error;
          }
        }
      }
      if (i)
        throw new oi(i);
    }
  }, t.prototype.add = function(e) {
    var n;
    if (e && e !== this)
      if (this.closed)
        ul(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this))
            return;
          e._addParent(this);
        }
        (this._finalizers = (n = this._finalizers) !== null && n !== void 0 ? n : []).push(e);
      }
  }, t.prototype._hasParent = function(e) {
    var n = this._parentage;
    return n === e || Array.isArray(n) && n.includes(e);
  }, t.prototype._addParent = function(e) {
    var n = this._parentage;
    this._parentage = Array.isArray(n) ? (n.push(e), n) : n ? [n, e] : e;
  }, t.prototype._removeParent = function(e) {
    var n = this._parentage;
    n === e ? this._parentage = null : Array.isArray(n) && Os(n, e);
  }, t.prototype.remove = function(e) {
    var n = this._finalizers;
    n && Os(n, e), e instanceof t && e._removeParent(this);
  }, t.EMPTY = function() {
    var e = new t();
    return e.closed = !0, e;
  }(), t;
}(), Gu = sr.EMPTY;
function Yu(t) {
  return t instanceof sr || t && "closed" in t && Kt(t.remove) && Kt(t.add) && Kt(t.unsubscribe);
}
function ul(t) {
  Kt(t) ? t() : t.unsubscribe();
}
var _g = {
  Promise: void 0
}, yg = {
  setTimeout: function(t, e) {
    for (var n = [], r = 2; r < arguments.length; r++)
      n[r - 2] = arguments[r];
    return setTimeout.apply(void 0, Lr([t, e], xr(n)));
  },
  clearTimeout: function(t) {
    return clearTimeout(t);
  },
  delegate: void 0
};
function zu(t) {
  yg.setTimeout(function() {
    throw t;
  });
}
function cl() {
}
function Es(t) {
  t();
}
var Oo = function(t) {
  Qe(e, t);
  function e(n) {
    var r = t.call(this) || this;
    return r.isStopped = !1, n ? (r.destination = n, Yu(n) && n.add(r)) : r.destination = Cg, r;
  }
  return e.create = function(n, r, s) {
    return new As(n, r, s);
  }, e.prototype.next = function(n) {
    this.isStopped || this._next(n);
  }, e.prototype.error = function(n) {
    this.isStopped || (this.isStopped = !0, this._error(n));
  }, e.prototype.complete = function() {
    this.isStopped || (this.isStopped = !0, this._complete());
  }, e.prototype.unsubscribe = function() {
    this.closed || (this.isStopped = !0, t.prototype.unsubscribe.call(this), this.destination = null);
  }, e.prototype._next = function(n) {
    this.destination.next(n);
  }, e.prototype._error = function(n) {
    try {
      this.destination.error(n);
    } finally {
      this.unsubscribe();
    }
  }, e.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }, e;
}(sr), Eg = function() {
  function t(e) {
    this.partialObserver = e;
  }
  return t.prototype.next = function(e) {
    var n = this.partialObserver;
    if (n.next)
      try {
        n.next(e);
      } catch (r) {
        Yr(r);
      }
  }, t.prototype.error = function(e) {
    var n = this.partialObserver;
    if (n.error)
      try {
        n.error(e);
      } catch (r) {
        Yr(r);
      }
    else
      Yr(e);
  }, t.prototype.complete = function() {
    var e = this.partialObserver;
    if (e.complete)
      try {
        e.complete();
      } catch (n) {
        Yr(n);
      }
  }, t;
}(), As = function(t) {
  Qe(e, t);
  function e(n, r, s) {
    var i = t.call(this) || this, o;
    return Kt(n) || !n ? o = {
      next: n ?? void 0,
      error: r ?? void 0,
      complete: s ?? void 0
    } : o = n, i.destination = new Eg(o), i;
  }
  return e;
}(Oo);
function Yr(t) {
  zu(t);
}
function vg(t) {
  throw t;
}
var Cg = {
  closed: !0,
  next: cl,
  error: vg,
  complete: cl
}, Ao = function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function Mn(t) {
  return t;
}
function Dv() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return Ku(t);
}
function Ku(t) {
  return t.length === 0 ? Mn : t.length === 1 ? t[0] : function(n) {
    return t.reduce(function(r, s) {
      return s(r);
    }, n);
  };
}
var ne = function() {
  function t(e) {
    e && (this._subscribe = e);
  }
  return t.prototype.lift = function(e) {
    var n = new t();
    return n.source = this, n.operator = e, n;
  }, t.prototype.subscribe = function(e, n, r) {
    var s = this, i = bg(e) ? e : new As(e, n, r);
    return Es(function() {
      var o = s, a = o.operator, l = o.source;
      i.add(a ? a.call(i, l) : l ? s._subscribe(i) : s._trySubscribe(i));
    }), i;
  }, t.prototype._trySubscribe = function(e) {
    try {
      return this._subscribe(e);
    } catch (n) {
      e.error(n);
    }
  }, t.prototype.forEach = function(e, n) {
    var r = this;
    return n = dl(n), new n(function(s, i) {
      var o = new As({
        next: function(a) {
          try {
            e(a);
          } catch (l) {
            i(l), o.unsubscribe();
          }
        },
        error: i,
        complete: s
      });
      r.subscribe(o);
    });
  }, t.prototype._subscribe = function(e) {
    var n;
    return (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(e);
  }, t.prototype[Ao] = function() {
    return this;
  }, t.prototype.pipe = function() {
    for (var e = [], n = 0; n < arguments.length; n++)
      e[n] = arguments[n];
    return Ku(e)(this);
  }, t.prototype.toPromise = function(e) {
    var n = this;
    return e = dl(e), new e(function(r, s) {
      var i;
      n.subscribe(function(o) {
        return i = o;
      }, function(o) {
        return s(o);
      }, function() {
        return r(i);
      });
    });
  }, t.create = function(e) {
    return new t(e);
  }, t;
}();
function dl(t) {
  var e;
  return (e = t ?? _g.Promise) !== null && e !== void 0 ? e : Promise;
}
function Rg(t) {
  return t && Kt(t.next) && Kt(t.error) && Kt(t.complete);
}
function bg(t) {
  return t && t instanceof Oo || Rg(t) && Yu(t);
}
function Ig(t) {
  return Kt(t == null ? void 0 : t.lift);
}
function $e(t) {
  return function(e) {
    if (Ig(e))
      return e.lift(function(n) {
        try {
          return t(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function xe(t, e, n, r, s) {
  return new Tg(t, e, n, r, s);
}
var Tg = function(t) {
  Qe(e, t);
  function e(n, r, s, i, o, a) {
    var l = t.call(this, n) || this;
    return l.onFinalize = o, l.shouldUnsubscribe = a, l._next = r ? function(u) {
      try {
        r(u);
      } catch (c) {
        n.error(c);
      }
    } : t.prototype._next, l._error = i ? function(u) {
      try {
        i(u);
      } catch (c) {
        n.error(c);
      } finally {
        this.unsubscribe();
      }
    } : t.prototype._error, l._complete = s ? function() {
      try {
        s();
      } catch (u) {
        n.error(u);
      } finally {
        this.unsubscribe();
      }
    } : t.prototype._complete, l;
  }
  return e.prototype.unsubscribe = function() {
    var n;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var r = this.closed;
      t.prototype.unsubscribe.call(this), !r && ((n = this.onFinalize) === null || n === void 0 || n.call(this));
    }
  }, e;
}(Oo), Sg = wo(function(t) {
  return function() {
    t(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
  };
}), ae = function(t) {
  Qe(e, t);
  function e() {
    var n = t.call(this) || this;
    return n.closed = !1, n.currentObservers = null, n.observers = [], n.isStopped = !1, n.hasError = !1, n.thrownError = null, n;
  }
  return e.prototype.lift = function(n) {
    var r = new hl(this, this);
    return r.operator = n, r;
  }, e.prototype._throwIfClosed = function() {
    if (this.closed)
      throw new Sg();
  }, e.prototype.next = function(n) {
    var r = this;
    Es(function() {
      var s, i;
      if (r._throwIfClosed(), !r.isStopped) {
        r.currentObservers || (r.currentObservers = Array.from(r.observers));
        try {
          for (var o = Ss(r.currentObservers), a = o.next(); !a.done; a = o.next()) {
            var l = a.value;
            l.next(n);
          }
        } catch (u) {
          s = { error: u };
        } finally {
          try {
            a && !a.done && (i = o.return) && i.call(o);
          } finally {
            if (s) throw s.error;
          }
        }
      }
    });
  }, e.prototype.error = function(n) {
    var r = this;
    Es(function() {
      if (r._throwIfClosed(), !r.isStopped) {
        r.hasError = r.isStopped = !0, r.thrownError = n;
        for (var s = r.observers; s.length; )
          s.shift().error(n);
      }
    });
  }, e.prototype.complete = function() {
    var n = this;
    Es(function() {
      if (n._throwIfClosed(), !n.isStopped) {
        n.isStopped = !0;
        for (var r = n.observers; r.length; )
          r.shift().complete();
      }
    });
  }, e.prototype.unsubscribe = function() {
    this.isStopped = this.closed = !0, this.observers = this.currentObservers = null;
  }, Object.defineProperty(e.prototype, "observed", {
    get: function() {
      var n;
      return ((n = this.observers) === null || n === void 0 ? void 0 : n.length) > 0;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype._trySubscribe = function(n) {
    return this._throwIfClosed(), t.prototype._trySubscribe.call(this, n);
  }, e.prototype._subscribe = function(n) {
    return this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n);
  }, e.prototype._innerSubscribe = function(n) {
    var r = this, s = this, i = s.hasError, o = s.isStopped, a = s.observers;
    return i || o ? Gu : (this.currentObservers = null, a.push(n), new sr(function() {
      r.currentObservers = null, Os(a, n);
    }));
  }, e.prototype._checkFinalizedStatuses = function(n) {
    var r = this, s = r.hasError, i = r.thrownError, o = r.isStopped;
    s ? n.error(i) : o && n.complete();
  }, e.prototype.asObservable = function() {
    var n = new ne();
    return n.source = this, n;
  }, e.create = function(n, r) {
    return new hl(n, r);
  }, e;
}(ne), hl = function(t) {
  Qe(e, t);
  function e(n, r) {
    var s = t.call(this) || this;
    return s.destination = n, s.source = r, s;
  }
  return e.prototype.next = function(n) {
    var r, s;
    (s = (r = this.destination) === null || r === void 0 ? void 0 : r.next) === null || s === void 0 || s.call(r, n);
  }, e.prototype.error = function(n) {
    var r, s;
    (s = (r = this.destination) === null || r === void 0 ? void 0 : r.error) === null || s === void 0 || s.call(r, n);
  }, e.prototype.complete = function() {
    var n, r;
    (r = (n = this.destination) === null || n === void 0 ? void 0 : n.complete) === null || r === void 0 || r.call(n);
  }, e.prototype._subscribe = function(n) {
    var r, s;
    return (s = (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(n)) !== null && s !== void 0 ? s : Gu;
  }, e;
}(ae), de = function(t) {
  Qe(e, t);
  function e(n) {
    var r = t.call(this) || this;
    return r._value = n, r;
  }
  return Object.defineProperty(e.prototype, "value", {
    get: function() {
      return this.getValue();
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype._subscribe = function(n) {
    var r = t.prototype._subscribe.call(this, n);
    return !r.closed && n.next(this._value), r;
  }, e.prototype.getValue = function() {
    var n = this, r = n.hasError, s = n.thrownError, i = n._value;
    if (r)
      throw s;
    return this._throwIfClosed(), i;
  }, e.prototype.next = function(n) {
    t.prototype.next.call(this, this._value = n);
  }, e;
}(ae), No = {
  now: function() {
    return (No.delegate || Date).now();
  },
  delegate: void 0
}, wg = function(t) {
  Qe(e, t);
  function e(n, r, s) {
    n === void 0 && (n = 1 / 0), r === void 0 && (r = 1 / 0), s === void 0 && (s = No);
    var i = t.call(this) || this;
    return i._bufferSize = n, i._windowTime = r, i._timestampProvider = s, i._buffer = [], i._infiniteTimeWindow = !0, i._infiniteTimeWindow = r === 1 / 0, i._bufferSize = Math.max(1, n), i._windowTime = Math.max(1, r), i;
  }
  return e.prototype.next = function(n) {
    var r = this, s = r.isStopped, i = r._buffer, o = r._infiniteTimeWindow, a = r._timestampProvider, l = r._windowTime;
    s || (i.push(n), !o && i.push(a.now() + l)), this._trimBuffer(), t.prototype.next.call(this, n);
  }, e.prototype._subscribe = function(n) {
    this._throwIfClosed(), this._trimBuffer();
    for (var r = this._innerSubscribe(n), s = this, i = s._infiniteTimeWindow, o = s._buffer, a = o.slice(), l = 0; l < a.length && !n.closed; l += i ? 1 : 2)
      n.next(a[l]);
    return this._checkFinalizedStatuses(n), r;
  }, e.prototype._trimBuffer = function() {
    var n = this, r = n._bufferSize, s = n._timestampProvider, i = n._buffer, o = n._infiniteTimeWindow, a = (o ? 1 : 2) * r;
    if (r < 1 / 0 && a < i.length && i.splice(0, i.length - a), !o) {
      for (var l = s.now(), u = 0, c = 1; c < i.length && i[c] <= l; c += 2)
        u = c;
      u && i.splice(0, u + 1);
    }
  }, e;
}(ae), Og = function(t) {
  Qe(e, t);
  function e(n, r) {
    return t.call(this) || this;
  }
  return e.prototype.schedule = function(n, r) {
    return this;
  }, e;
}(sr), fl = {
  setInterval: function(t, e) {
    for (var n = [], r = 2; r < arguments.length; r++)
      n[r - 2] = arguments[r];
    return setInterval.apply(void 0, Lr([t, e], xr(n)));
  },
  clearInterval: function(t) {
    return clearInterval(t);
  },
  delegate: void 0
}, Ag = function(t) {
  Qe(e, t);
  function e(n, r) {
    var s = t.call(this, n, r) || this;
    return s.scheduler = n, s.work = r, s.pending = !1, s;
  }
  return e.prototype.schedule = function(n, r) {
    var s;
    if (r === void 0 && (r = 0), this.closed)
      return this;
    this.state = n;
    var i = this.id, o = this.scheduler;
    return i != null && (this.id = this.recycleAsyncId(o, i, r)), this.pending = !0, this.delay = r, this.id = (s = this.id) !== null && s !== void 0 ? s : this.requestAsyncId(o, this.id, r), this;
  }, e.prototype.requestAsyncId = function(n, r, s) {
    return s === void 0 && (s = 0), fl.setInterval(n.flush.bind(n, this), s);
  }, e.prototype.recycleAsyncId = function(n, r, s) {
    if (s === void 0 && (s = 0), s != null && this.delay === s && this.pending === !1)
      return r;
    r != null && fl.clearInterval(r);
  }, e.prototype.execute = function(n, r) {
    if (this.closed)
      return new Error("executing a cancelled action");
    this.pending = !1;
    var s = this._execute(n, r);
    if (s)
      return s;
    this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }, e.prototype._execute = function(n, r) {
    var s = !1, i;
    try {
      this.work(n);
    } catch (o) {
      s = !0, i = o || new Error("Scheduled action threw falsy error");
    }
    if (s)
      return this.unsubscribe(), i;
  }, e.prototype.unsubscribe = function() {
    if (!this.closed) {
      var n = this, r = n.id, s = n.scheduler, i = s.actions;
      this.work = this.state = this.scheduler = null, this.pending = !1, Os(i, this), r != null && (this.id = this.recycleAsyncId(s, r, null)), this.delay = null, t.prototype.unsubscribe.call(this);
    }
  }, e;
}(Og), pl = function() {
  function t(e, n) {
    n === void 0 && (n = t.now), this.schedulerActionCtor = e, this.now = n;
  }
  return t.prototype.schedule = function(e, n, r) {
    return n === void 0 && (n = 0), new this.schedulerActionCtor(this, e).schedule(r, n);
  }, t.now = No.now, t;
}(), Ng = function(t) {
  Qe(e, t);
  function e(n, r) {
    r === void 0 && (r = pl.now);
    var s = t.call(this, n, r) || this;
    return s.actions = [], s._active = !1, s;
  }
  return e.prototype.flush = function(n) {
    var r = this.actions;
    if (this._active) {
      r.push(n);
      return;
    }
    var s;
    this._active = !0;
    do
      if (s = n.execute(n.state, n.delay))
        break;
    while (n = r.shift());
    if (this._active = !1, s) {
      for (; n = r.shift(); )
        n.unsubscribe();
      throw s;
    }
  }, e;
}(pl), Xu = new Ng(Ag), Dg = Xu, Qu = new ne(function(t) {
  return t.complete();
});
function Ju(t) {
  return t && Kt(t.schedule);
}
function Do(t) {
  return t[t.length - 1];
}
function Mg(t) {
  return Kt(Do(t)) ? t.pop() : void 0;
}
function Mo(t) {
  return Ju(Do(t)) ? t.pop() : void 0;
}
function Lg(t, e) {
  return typeof Do(t) == "number" ? t.pop() : e;
}
var Zu = function(t) {
  return t && typeof t.length == "number" && typeof t != "function";
};
function qu(t) {
  return Kt(t == null ? void 0 : t.then);
}
function tc(t) {
  return Kt(t[Ao]);
}
function ec(t) {
  return Symbol.asyncIterator && Kt(t == null ? void 0 : t[Symbol.asyncIterator]);
}
function nc(t) {
  return new TypeError("You provided " + (t !== null && typeof t == "object" ? "an invalid object" : "'" + t + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function xg() {
  return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var rc = xg();
function sc(t) {
  return Kt(t == null ? void 0 : t[rc]);
}
function ic(t) {
  return Kd(this, arguments, function() {
    var n, r, s, i;
    return vu(this, function(o) {
      switch (o.label) {
        case 0:
          n = t.getReader(), o.label = 1;
        case 1:
          o.trys.push([1, , 9, 10]), o.label = 2;
        case 2:
          return [4, ni(n.read())];
        case 3:
          return r = o.sent(), s = r.value, i = r.done, i ? [4, ni(void 0)] : [3, 5];
        case 4:
          return [2, o.sent()];
        case 5:
          return [4, ni(s)];
        case 6:
          return [4, o.sent()];
        case 7:
          return o.sent(), [3, 2];
        case 8:
          return [3, 10];
        case 9:
          return n.releaseLock(), [7];
        case 10:
          return [2];
      }
    });
  });
}
function oc(t) {
  return Kt(t == null ? void 0 : t.getReader);
}
function ir(t) {
  if (t instanceof ne)
    return t;
  if (t != null) {
    if (tc(t))
      return Fg(t);
    if (Zu(t))
      return Ug(t);
    if (qu(t))
      return Pg(t);
    if (ec(t))
      return ac(t);
    if (sc(t))
      return kg(t);
    if (oc(t))
      return Bg(t);
  }
  throw nc(t);
}
function Fg(t) {
  return new ne(function(e) {
    var n = t[Ao]();
    if (Kt(n.subscribe))
      return n.subscribe(e);
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function Ug(t) {
  return new ne(function(e) {
    for (var n = 0; n < t.length && !e.closed; n++)
      e.next(t[n]);
    e.complete();
  });
}
function Pg(t) {
  return new ne(function(e) {
    t.then(function(n) {
      e.closed || (e.next(n), e.complete());
    }, function(n) {
      return e.error(n);
    }).then(null, zu);
  });
}
function kg(t) {
  return new ne(function(e) {
    var n, r;
    try {
      for (var s = Ss(t), i = s.next(); !i.done; i = s.next()) {
        var o = i.value;
        if (e.next(o), e.closed)
          return;
      }
    } catch (a) {
      n = { error: a };
    } finally {
      try {
        i && !i.done && (r = s.return) && r.call(s);
      } finally {
        if (n) throw n.error;
      }
    }
    e.complete();
  });
}
function ac(t) {
  return new ne(function(e) {
    Hg(t, e).catch(function(n) {
      return e.error(n);
    });
  });
}
function Bg(t) {
  return ac(ic(t));
}
function Hg(t, e) {
  var n, r, s, i;
  return Xd(this, void 0, void 0, function() {
    var o, a;
    return vu(this, function(l) {
      switch (l.label) {
        case 0:
          l.trys.push([0, 5, 6, 11]), n = Qd(t), l.label = 1;
        case 1:
          return [4, n.next()];
        case 2:
          if (r = l.sent(), !!r.done) return [3, 4];
          if (o = r.value, e.next(o), e.closed)
            return [2];
          l.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          return a = l.sent(), s = { error: a }, [3, 11];
        case 6:
          return l.trys.push([6, , 9, 10]), r && !r.done && (i = n.return) ? [4, i.call(n)] : [3, 8];
        case 7:
          l.sent(), l.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (s) throw s.error;
          return [7];
        case 10:
          return [7];
        case 11:
          return e.complete(), [2];
      }
    });
  });
}
function gn(t, e, n, r, s) {
  r === void 0 && (r = 0), s === void 0 && (s = !1);
  var i = e.schedule(function() {
    n(), s ? t.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if (t.add(i), !s)
    return i;
}
function lc(t, e) {
  return e === void 0 && (e = 0), $e(function(n, r) {
    n.subscribe(xe(r, function(s) {
      return gn(r, t, function() {
        return r.next(s);
      }, e);
    }, function() {
      return gn(r, t, function() {
        return r.complete();
      }, e);
    }, function(s) {
      return gn(r, t, function() {
        return r.error(s);
      }, e);
    }));
  });
}
function uc(t, e) {
  return e === void 0 && (e = 0), $e(function(n, r) {
    r.add(t.schedule(function() {
      return n.subscribe(r);
    }, e));
  });
}
function jg(t, e) {
  return ir(t).pipe(uc(e), lc(e));
}
function $g(t, e) {
  return ir(t).pipe(uc(e), lc(e));
}
function Wg(t, e) {
  return new ne(function(n) {
    var r = 0;
    return e.schedule(function() {
      r === t.length ? n.complete() : (n.next(t[r++]), n.closed || this.schedule());
    });
  });
}
function Vg(t, e) {
  return new ne(function(n) {
    var r;
    return gn(n, e, function() {
      r = t[rc](), gn(n, e, function() {
        var s, i, o;
        try {
          s = r.next(), i = s.value, o = s.done;
        } catch (a) {
          n.error(a);
          return;
        }
        o ? n.complete() : n.next(i);
      }, 0, !0);
    }), function() {
      return Kt(r == null ? void 0 : r.return) && r.return();
    };
  });
}
function cc(t, e) {
  if (!t)
    throw new Error("Iterable cannot be null");
  return new ne(function(n) {
    gn(n, e, function() {
      var r = t[Symbol.asyncIterator]();
      gn(n, e, function() {
        r.next().then(function(s) {
          s.done ? n.complete() : n.next(s.value);
        });
      }, 0, !0);
    });
  });
}
function Gg(t, e) {
  return cc(ic(t), e);
}
function Yg(t, e) {
  if (t != null) {
    if (tc(t))
      return jg(t, e);
    if (Zu(t))
      return Wg(t, e);
    if (qu(t))
      return $g(t, e);
    if (ec(t))
      return cc(t, e);
    if (sc(t))
      return Vg(t, e);
    if (oc(t))
      return Gg(t, e);
  }
  throw nc(t);
}
function $s(t, e) {
  return e ? Yg(t, e) : ir(t);
}
function zr() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  var n = Mo(t);
  return $s(t, n);
}
var Lo = wo(function(t) {
  return function() {
    t(this), this.name = "EmptyError", this.message = "no elements in sequence";
  };
});
function zg(t, e) {
  return new Promise(function(n, r) {
    var s = new As({
      next: function(i) {
        n(i), s.unsubscribe();
      },
      error: r,
      complete: function() {
        r(new Lo());
      }
    });
    t.subscribe(s);
  });
}
function Kg(t) {
  return t instanceof Date && !isNaN(t);
}
function or(t, e) {
  return $e(function(n, r) {
    var s = 0;
    n.subscribe(xe(r, function(i) {
      r.next(t.call(e, i, s++));
    }));
  });
}
var Xg = Array.isArray;
function Qg(t, e) {
  return Xg(e) ? t.apply(void 0, Lr([], xr(e))) : t(e);
}
function Jg(t) {
  return or(function(e) {
    return Qg(t, e);
  });
}
var Zg = Array.isArray, qg = Object.getPrototypeOf, tm = Object.prototype, em = Object.keys;
function nm(t) {
  if (t.length === 1) {
    var e = t[0];
    if (Zg(e))
      return { args: e, keys: null };
    if (rm(e)) {
      var n = em(e);
      return {
        args: n.map(function(r) {
          return e[r];
        }),
        keys: n
      };
    }
  }
  return { args: t, keys: null };
}
function rm(t) {
  return t && typeof t == "object" && qg(t) === tm;
}
function sm(t, e) {
  return t.reduce(function(n, r, s) {
    return n[r] = e[s], n;
  }, {});
}
function im() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  var n = Mo(t), r = Mg(t), s = nm(t), i = s.args, o = s.keys;
  if (i.length === 0)
    return $s([], n);
  var a = new ne(om(i, n, o ? function(l) {
    return sm(o, l);
  } : Mn));
  return r ? a.pipe(Jg(r)) : a;
}
function om(t, e, n) {
  return n === void 0 && (n = Mn), function(r) {
    gl(e, function() {
      for (var s = t.length, i = new Array(s), o = s, a = s, l = function(c) {
        gl(e, function() {
          var d = $s(t[c], e), h = !1;
          d.subscribe(xe(r, function(f) {
            i[c] = f, h || (h = !0, a--), a || r.next(n(i.slice()));
          }, function() {
            --o || r.complete();
          }));
        }, r);
      }, u = 0; u < s; u++)
        l(u);
    }, r);
  };
}
function gl(t, e, n) {
  t ? gn(n, t, e) : e();
}
function am(t, e, n, r, s, i, o, a) {
  var l = [], u = 0, c = 0, d = !1, h = function() {
    d && !l.length && !u && e.complete();
  }, f = function(g) {
    return u < r ? p(g) : l.push(g);
  }, p = function(g) {
    u++;
    var _ = !1;
    ir(n(g, c++)).subscribe(xe(e, function(C) {
      e.next(C);
    }, function() {
      _ = !0;
    }, void 0, function() {
      if (_)
        try {
          u--;
          for (var C = function() {
            var S = l.shift();
            o || p(S);
          }; l.length && u < r; )
            C();
          h();
        } catch (S) {
          e.error(S);
        }
    }));
  };
  return t.subscribe(xe(e, f, function() {
    d = !0, h();
  })), function() {
  };
}
function dc(t, e, n) {
  return n === void 0 && (n = 1 / 0), Kt(e) ? dc(function(r, s) {
    return or(function(i, o) {
      return e(r, i, s, o);
    })(ir(t(r, s)));
  }, n) : (typeof e == "number" && (n = e), $e(function(r, s) {
    return am(r, s, t, n);
  }));
}
function lm(t) {
  return t === void 0 && (t = 1 / 0), dc(Mn, t);
}
function um(t, e, n) {
  t === void 0 && (t = 0), n === void 0 && (n = Dg);
  var r = -1;
  return e != null && (Ju(e) ? n = e : r = e), new ne(function(s) {
    var i = Kg(t) ? +t - n.now() : t;
    i < 0 && (i = 0);
    var o = 0;
    return n.schedule(function() {
      s.closed || (s.next(o++), 0 <= r ? this.schedule(void 0, r) : s.complete());
    }, i);
  });
}
function hc() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  var n = Mo(t), r = Lg(t, 1 / 0), s = t;
  return s.length ? s.length === 1 ? ir(s[0]) : lm(r)($s(s, n)) : Qu;
}
function mn(t, e) {
  return $e(function(n, r) {
    var s = 0;
    n.subscribe(xe(r, function(i) {
      return t.call(e, i, s++) && r.next(i);
    }));
  });
}
function fc(t, e) {
  return e === void 0 && (e = Xu), $e(function(n, r) {
    var s = null, i = null, o = null, a = function() {
      if (s) {
        s.unsubscribe(), s = null;
        var u = i;
        i = null, r.next(u);
      }
    };
    function l() {
      var u = o + t, c = e.now();
      if (c < u) {
        s = this.schedule(void 0, u - c), r.add(s);
        return;
      }
      a();
    }
    n.subscribe(xe(r, function(u) {
      i = u, o = e.now(), s || (s = e.schedule(l, t), r.add(s));
    }, function() {
      a(), r.complete();
    }, void 0, function() {
      i = s = null;
    }));
  });
}
function cm(t) {
  return $e(function(e, n) {
    var r = !1;
    e.subscribe(xe(n, function(s) {
      r = !0, n.next(s);
    }, function() {
      r || n.next(t), n.complete();
    }));
  });
}
function pc(t) {
  return t <= 0 ? function() {
    return Qu;
  } : $e(function(e, n) {
    var r = 0;
    e.subscribe(xe(n, function(s) {
      ++r <= t && (n.next(s), t <= r && n.complete());
    }));
  });
}
function dm(t, e) {
  return e === void 0 && (e = Mn), t = t ?? hm, $e(function(n, r) {
    var s, i = !0;
    n.subscribe(xe(r, function(o) {
      var a = e(o);
      (i || !t(s, a)) && (i = !1, s = a, r.next(o));
    }));
  });
}
function hm(t, e) {
  return t === e;
}
function fm(t) {
  return t === void 0 && (t = pm), $e(function(e, n) {
    var r = !1;
    e.subscribe(xe(n, function(s) {
      r = !0, n.next(s);
    }, function() {
      return r ? n.complete() : n.error(t());
    }));
  });
}
function pm() {
  return new Lo();
}
function gm(t, e) {
  var n = arguments.length >= 2;
  return function(r) {
    return r.pipe(t ? mn(function(s, i) {
      return t(s, i, r);
    }) : Mn, pc(1), n ? cm(e) : fm(function() {
      return new Lo();
    }));
  };
}
function gc(t) {
  return mn(function(e, n) {
    return t <= n;
  });
}
function ml(t, e, n) {
  var r = Kt(t) || e || n ? { next: t, error: e, complete: n } : t;
  return r ? $e(function(s, i) {
    var o;
    (o = r.subscribe) === null || o === void 0 || o.call(r);
    var a = !0;
    s.subscribe(xe(i, function(l) {
      var u;
      (u = r.next) === null || u === void 0 || u.call(r, l), i.next(l);
    }, function() {
      var l;
      a = !1, (l = r.complete) === null || l === void 0 || l.call(r), i.complete();
    }, function(l) {
      var u;
      a = !1, (u = r.error) === null || u === void 0 || u.call(r, l), i.error(l);
    }, function() {
      var l, u;
      a && ((l = r.unsubscribe) === null || l === void 0 || l.call(r)), (u = r.finalize) === null || u === void 0 || u.call(r);
    }));
  }) : Mn;
}
var Et = /* @__PURE__ */ ((t) => (t[t.UNIVER_UNKNOWN = 0] = "UNIVER_UNKNOWN", t[t.UNIVER_DOC = 1] = "UNIVER_DOC", t[t.UNIVER_SHEET = 2] = "UNIVER_SHEET", t[t.UNIVER_SLIDE = 3] = "UNIVER_SLIDE", t[t.UNIVER_PROJECT = 4] = "UNIVER_PROJECT", t[t.UNRECOGNIZED = -1] = "UNRECOGNIZED", t))(Et || {}), mm = /* @__PURE__ */ ((t) => (t[t.View = 0] = "View", t[t.Edit = 1] = "Edit", t[t.ManageCollaborator = 2] = "ManageCollaborator", t[t.Print = 3] = "Print", t[t.Duplicate = 4] = "Duplicate", t[t.Comment = 5] = "Comment", t[t.Copy = 6] = "Copy", t[t.Share = 7] = "Share", t[t.Export = 8] = "Export", t[t.MoveWorksheet = 9] = "MoveWorksheet", t[t.DeleteWorksheet = 10] = "DeleteWorksheet", t[t.HideWorksheet = 11] = "HideWorksheet", t[t.RenameWorksheet = 12] = "RenameWorksheet", t[t.CreateWorksheet = 13] = "CreateWorksheet", t[t.SetWorksheetStyle = 14] = "SetWorksheetStyle", t[t.EditWorksheetCell = 15] = "EditWorksheetCell", t[t.InsertHyperlink = 16] = "InsertHyperlink", t[t.Sort = 17] = "Sort", t[t.Filter = 18] = "Filter", t[t.PivotTable = 19] = "PivotTable", t[t.FloatImg = 20] = "FloatImg", t[t.History = 21] = "History", t[t.RwHgtClWdt = 22] = "RwHgtClWdt", t[t.ViemRwHgtClWdt = 23] = "ViemRwHgtClWdt", t[t.ViewFilter = 24] = "ViewFilter", t[t.MoveSheet = 25] = "MoveSheet", t[t.DeleteSheet = 26] = "DeleteSheet", t[t.HideSheet = 27] = "HideSheet", t[t.CopySheet = 28] = "CopySheet", t[t.RenameSheet = 29] = "RenameSheet", t[t.CreateSheet = 30] = "CreateSheet", t[t.SelectProtectedCells = 31] = "SelectProtectedCells", t[t.SelectUnProtectedCells = 32] = "SelectUnProtectedCells", t[t.SetCellStyle = 33] = "SetCellStyle", t[t.SetCellValue = 34] = "SetCellValue", t[t.SetRowStyle = 35] = "SetRowStyle", t[t.SetColumnStyle = 36] = "SetColumnStyle", t[t.InsertRow = 37] = "InsertRow", t[t.InsertColumn = 38] = "InsertColumn", t[t.DeleteRow = 39] = "DeleteRow", t[t.DeleteColumn = 40] = "DeleteColumn", t[t.EditExtraObject = 41] = "EditExtraObject", t[t.Delete = 42] = "Delete", t[t.RecoverHistory = 43] = "RecoverHistory", t[t.ViewHistory = 44] = "ViewHistory", t[t.CreatePermissionObject = 45] = "CreatePermissionObject", t[t.UNRECOGNIZED = -1] = "UNRECOGNIZED", t))(mm || {}), gt = /* @__PURE__ */ ((t) => (t[t.Reader = 0] = "Reader", t[t.Editor = 1] = "Editor", t[t.Owner = 2] = "Owner", t[t.UNRECOGNIZED = -1] = "UNRECOGNIZED", t))(gt || {}), _m = /* @__PURE__ */ ((t) => (t[t.Unkonwn = 0] = "Unkonwn", t[t.Workbook = 1] = "Workbook", t[t.Worksheet = 2] = "Worksheet", t[t.SelectRange = 3] = "SelectRange", t[t.Document = 4] = "Document", t[t.Slide = 5] = "Slide", t[t.UNRECOGNIZED = -1] = "UNRECOGNIZED", t))(_m || {}), Di = /* @__PURE__ */ ((t) => (t[t.SomeCollaborator = 0] = "SomeCollaborator", t[t.AllCollaborator = 1] = "AllCollaborator", t[t.OneSelf = 2] = "OneSelf", t[t.UNRECOGNIZED = -1] = "UNRECOGNIZED", t))(Di || {});
let ym = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", Em = (t) => crypto.getRandomValues(new Uint8Array(t)), vm = (t, e, n) => {
  let r = (2 << Math.log2(t.length - 1)) - 1, s = -~(1.6 * r * e / t.length);
  return (i = e) => {
    let o = "";
    for (; ; ) {
      let a = n(s), l = s | 0;
      for (; l--; )
        if (o += t[a[l] & r] || "", o.length >= i) return o;
    }
  };
}, Cm = (t, e = 21) => vm(t, e | 0, Em), Rm = (t = 21) => {
  let e = "", n = crypto.getRandomValues(new Uint8Array(t |= 0));
  for (; t--; )
    e += ym[n[t] & 63];
  return e;
};
var fe = {}, mc = {}, xo = {};
Object.defineProperty(xo, "__esModule", { value: !0 });
function bm(t, e) {
  if (Array.isArray(e))
    return !1;
  for (let n in t)
    if (!Fo(t[n], e[n]))
      return !1;
  for (let n in e)
    if (t[n] === void 0)
      return !1;
  return !0;
}
function Im(t, e) {
  if (!Array.isArray(e) || t.length !== e.length)
    return !1;
  for (let n = 0; n < t.length; n++)
    if (!Fo(t[n], e[n]))
      return !1;
  return !0;
}
function Fo(t, e) {
  return t === e ? !0 : t === null || e === null || typeof t != "object" || typeof e != "object" ? !1 : Array.isArray(t) ? Im(t, e) : bm(t, e);
}
xo.default = Fo;
var Uo = {};
Object.defineProperty(Uo, "__esModule", { value: !0 });
function Mi(t) {
  if (t === null)
    return null;
  if (Array.isArray(t))
    return t.map(Mi);
  if (typeof t == "object") {
    const e = {};
    for (let n in t)
      e[n] = Mi(t[n]);
    return e;
  } else
    return t;
}
Uo.default = Mi;
var Po = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.eachChildOf = t.advancer = t.readCursor = t.writeCursor = t.WriteCursor = t.ReadCursor = t.isValidPathItem = void 0;
  function e(c, d) {
    if (!c)
      throw new Error(d);
  }
  const n = (c) => c != null && typeof c == "object" && !Array.isArray(c), r = (c, d) => (
    // All the numbers, then all the letters. Just as the gods of ascii intended.
    typeof c == typeof d ? c > d : typeof c == "string" && typeof d == "number"
  );
  function s(c, d) {
    for (let h in c) {
      const f = h;
      d.write(f, c[f]);
    }
  }
  t.isValidPathItem = (c) => typeof c == "number" || typeof c == "string" && c !== "__proto__";
  class i {
    constructor(d = null) {
      this.parents = [], this.indexes = [], this.lcIdx = -1, this.idx = -1, this.container = d;
    }
    ascend() {
      e(this.parents.length === this.indexes.length / 2), this.idx === 0 ? this.parents.length ? (this.lcIdx = this.indexes.pop(), this.container = this.parents.pop(), this.idx = this.indexes.pop()) : (this.lcIdx = 0, this.idx = -1) : (e(this.idx > 0), this.idx--, n(this.container[this.idx]) && this.idx--);
    }
    getPath() {
      const d = [];
      let h = this.container, f = this.parents.length - 1, p = this.idx;
      for (; p >= 0; )
        d.unshift(h[p]), p === 0 ? (p = this.indexes[f * 2], h = this.parents[f--]) : p -= n(h[p - 1]) ? 2 : 1;
      return d;
    }
  }
  class o extends i {
    get() {
      return this.container ? this.container.slice(this.idx + 1) : null;
    }
    // Its only valid to call this after descending into a child.
    getKey() {
      return e(this.container != null, "Invalid call to getKey before cursor descended"), this.container[this.idx];
    }
    getComponent() {
      let d;
      return this.container && this.container.length > this.idx + 1 && n(d = this.container[this.idx + 1]) ? d : null;
    }
    descendFirst() {
      let d = this.idx + 1;
      if (!this.container || d >= this.container.length || n(this.container[d]) && d + 1 >= this.container.length)
        return !1;
      n(this.container[d]) && d++;
      const h = this.container[d];
      return Array.isArray(h) ? (this.indexes.push(this.idx), this.parents.push(this.container), this.indexes.push(d), this.idx = 0, this.container = h) : this.idx = d, !0;
    }
    nextSibling() {
      if (e(this.parents.length === this.indexes.length / 2), this.idx > 0 || this.parents.length === 0)
        return !1;
      const d = this.indexes[this.indexes.length - 1] + 1, h = this.parents[this.parents.length - 1];
      return d >= h.length ? !1 : (e(!isNaN(d)), this.indexes[this.indexes.length - 1] = d, this.container = h[d], !0);
    }
    _init(d, h, f, p) {
      this.container = d, this.idx = h, this.parents = f.slice(), this.indexes = p.slice();
    }
    clone() {
      const d = new o();
      return d._init(this.container, this.idx, this.parents, this.indexes), d;
    }
    *[Symbol.iterator]() {
      if (this.descendFirst()) {
        do
          yield this.getKey();
        while (this.nextSibling());
        this.ascend();
      }
    }
    // TODO(cleanup): Consider moving these functions out of cursor, since
    // they're really just helper methods.
    // It'd be really nice to do this using generators.
    traverse(d, h) {
      const f = this.getComponent();
      f && h(f, d);
      for (const p of this)
        d && d.descend(p), this.traverse(d, h), d && d.ascend();
    }
    eachPick(d, h) {
      this.traverse(d, (f, p) => {
        f.p != null && h(f.p, p);
      });
    }
    eachDrop(d, h) {
      this.traverse(d, (f, p) => {
        f.d != null && h(f.d, p);
      });
    }
  }
  t.ReadCursor = o;
  class a extends i {
    constructor(d = null) {
      super(d), this.pendingDescent = [], this._op = d;
    }
    flushDescent() {
      e(this.parents.length === this.indexes.length / 2), this.container === null && (this._op = this.container = []);
      for (let d = 0; d < this.pendingDescent.length; d++) {
        const h = this.pendingDescent[d];
        let f = this.idx + 1;
        if (f < this.container.length && n(this.container[f]) && f++, e(f === this.container.length || !n(this.container[f])), f === this.container.length)
          this.container.push(h), this.idx = f;
        else if (this.container[f] === h)
          this.idx = f;
        else {
          if (!Array.isArray(this.container[f])) {
            const p = this.container.splice(f, this.container.length - f);
            this.container.push(p), this.lcIdx > -1 && (this.lcIdx = f);
          }
          for (this.indexes.push(this.idx), this.parents.push(this.container), this.lcIdx !== -1 && (e(r(h, this.container[this.lcIdx][0])), f = this.lcIdx + 1, this.lcIdx = -1); f < this.container.length && r(h, this.container[f][0]); )
            f++;
          if (this.indexes.push(f), this.idx = 0, f < this.container.length && this.container[f][0] === h)
            this.container = this.container[f];
          else {
            const p = [h];
            this.container.splice(f, 0, p), this.container = p;
          }
        }
      }
      this.pendingDescent.length = 0;
    }
    reset() {
      this.lcIdx = -1;
    }
    // Creates and returns a component, creating one if need be. You should
    // probably write to it immediately - ops are not valid with empty
    // components.
    getComponent() {
      this.flushDescent();
      const d = this.idx + 1;
      if (d < this.container.length && n(this.container[d]))
        return this.container[d];
      {
        const h = {};
        return this.container.splice(d, 0, h), h;
      }
    }
    write(d, h) {
      const f = this.getComponent();
      e(f[d] == null || f[d] === h, "Internal consistency error: Overwritten component. File a bug"), f[d] = h;
    }
    get() {
      return this._op;
    }
    descend(d) {
      if (!t.isValidPathItem(d))
        throw Error("Invalid JSON key");
      this.pendingDescent.push(d);
    }
    descendPath(d) {
      return this.pendingDescent.push(...d), this;
    }
    ascend() {
      this.pendingDescent.length ? this.pendingDescent.pop() : super.ascend();
    }
    mergeTree(d, h = s) {
      if (d === null)
        return;
      if (e(Array.isArray(d)), d === this._op)
        throw Error("Cannot merge into my own tree");
      const f = this.lcIdx, p = this.parents.length;
      let g = 0;
      for (let _ = 0; _ < d.length; _++) {
        const C = d[_];
        typeof C == "string" || typeof C == "number" ? (g++, this.descend(C)) : Array.isArray(C) ? this.mergeTree(C, h) : typeof C == "object" && h(C, this);
      }
      for (; g--; )
        this.ascend();
      this.lcIdx = this.parents.length === p ? f : -1;
    }
    at(d, h) {
      this.descendPath(d), h(this);
      for (let f = 0; f < d.length; f++)
        this.ascend();
      return this;
    }
    // This is used by helpers, so the strict ordering guarantees are
    // relaxed.
    writeAtPath(d, h, f) {
      return this.at(d, () => this.write(h, f)), this.reset(), this;
    }
    writeMove(d, h, f = 0) {
      return this.writeAtPath(d, "p", f).writeAtPath(h, "d", f);
    }
    getPath() {
      const d = super.getPath();
      return d.push(...this.pendingDescent), d;
    }
  }
  t.WriteCursor = a, t.writeCursor = () => new a(), t.readCursor = (c) => new o(c);
  function l(c, d, h) {
    let f, p;
    p = f = c ? c.descendFirst() : !1;
    function g(_) {
      let C;
      for (; p; ) {
        const S = C = c.getKey();
        if (_ != null) {
          let T = !1;
          if (d && typeof S == "number" && (C = d(S, c.getComponent()), C < 0 && (C = ~C, T = !0)), r(C, _))
            return null;
          if (C === _ && !T)
            return c;
        }
        h && typeof C == "number" && h(C, c.getComponent()), p = c.nextSibling();
      }
      return null;
    }
    return g.end = () => {
      f && c.ascend();
    }, g;
  }
  t.advancer = l;
  function u(c, d, h) {
    let f, p, g, _;
    for (f = p = c && c.descendFirst(), g = _ = d && d.descendFirst(); f || g; ) {
      let C = f ? c.getKey() : null, S = g ? d.getKey() : null;
      C !== null && S !== null && (r(S, C) ? S = null : C !== S && (C = null)), h(C ?? S, C != null ? c : null, S != null ? d : null), C != null && f && (f = c.nextSibling()), S != null && g && (g = d.nextSibling());
    }
    p && c.ascend(), _ && d.ascend();
  }
  t.eachChildOf = u;
})(Po);
var ko = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.ConflictType = void 0, function(e) {
    e[e.RM_UNEXPECTED_CONTENT = 1] = "RM_UNEXPECTED_CONTENT", e[e.DROP_COLLISION = 2] = "DROP_COLLISION", e[e.BLACKHOLE = 3] = "BLACKHOLE";
  }(t.ConflictType || (t.ConflictType = {}));
})(ko);
var ai = {}, bn = {}, _l;
function Bo() {
  return _l || (_l = 1, Object.defineProperty(bn, "__esModule", { value: !0 }), bn.uniToStrPos = bn.strPosToUni = void 0, bn.strPosToUni = (t, e = t.length) => {
    let n = 0, r = 0;
    for (; r < e; r++) {
      const s = t.charCodeAt(r);
      s >= 55296 && s <= 57343 && (n++, r++);
    }
    if (r !== e)
      throw Error("Invalid offset - splits unicode bytes");
    return r - n;
  }, bn.uniToStrPos = (t, e) => {
    let n = 0;
    for (; e > 0; e--) {
      const r = t.charCodeAt(n);
      n += r >= 55296 && r <= 57343 ? 2 : 1;
    }
    return n;
  }), bn;
}
var li = {}, yl;
function Li() {
  return yl || (yl = 1, function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.uniSlice = t.dlen = t.eachOp = void 0;
    const e = Bo(), n = (E) => {
      if (!Array.isArray(E))
        throw Error("Op must be an array of components");
      let v = null;
      for (let R = 0; R < E.length; R++) {
        const I = E[R];
        switch (typeof I) {
          case "object":
            if (typeof I.d != "number" && typeof I.d != "string")
              throw Error("Delete must be number or string");
            if (t.dlen(I.d) <= 0)
              throw Error("Deletes must not be empty");
            break;
          case "string":
            if (!(I.length > 0))
              throw Error("Inserts cannot be empty");
            break;
          case "number":
            if (!(I > 0))
              throw Error("Skip components must be >0");
            if (typeof v == "number")
              throw Error("Adjacent skip components should be combined");
            break;
        }
        v = I;
      }
      if (typeof v == "number")
        throw Error("Op has a trailing skip");
    };
    function r(E, v) {
      let R = 0, I = 0;
      for (let A = 0; A < E.length; A++) {
        const L = E[A];
        switch (v(L, R, I), typeof L) {
          case "object":
            R += t.dlen(L.d);
            break;
          case "string":
            I += e.strPosToUni(L);
            break;
          case "number":
            R += L, I += L;
            break;
        }
      }
    }
    t.eachOp = r;
    function s(E, v) {
      const R = [], I = a(R);
      return r(E, (A, L, N) => {
        I(v(A, L, N));
      }), d(R);
    }
    const i = (E) => E, o = (E) => s(E, i);
    t.dlen = (E) => typeof E == "number" ? E : e.strPosToUni(E);
    const a = (E) => (v) => {
      if (!(!v || v.d === 0 || v.d === "")) if (E.length === 0)
        E.push(v);
      else if (typeof v == typeof E[E.length - 1])
        if (typeof v == "object") {
          const R = E[E.length - 1];
          R.d = typeof R.d == "string" && typeof v.d == "string" ? R.d + v.d : t.dlen(R.d) + t.dlen(v.d);
        } else
          E[E.length - 1] += v;
      else
        E.push(v);
    }, l = (E) => typeof E == "number" ? E : typeof E == "string" ? e.strPosToUni(E) : typeof E.d == "number" ? E.d : e.strPosToUni(E.d);
    t.uniSlice = (E, v, R) => {
      const I = e.uniToStrPos(E, v), A = R == null ? 1 / 0 : e.uniToStrPos(E, R);
      return E.slice(I, A);
    };
    const u = (E, v, R) => typeof E == "number" ? R == null ? E - v : Math.min(E, R) - v : t.uniSlice(E, v, R), c = (E) => {
      let v = 0, R = 0;
      return { take: (L, N) => {
        if (v === E.length)
          return L === -1 ? null : L;
        const ut = E[v];
        let ct;
        if (typeof ut == "number")
          return L === -1 || ut - R <= L ? (ct = ut - R, ++v, R = 0, ct) : (R += L, L);
        if (typeof ut == "string") {
          if (L === -1 || N === "i" || e.strPosToUni(ut.slice(R)) <= L)
            return ct = ut.slice(R), ++v, R = 0, ct;
          {
            const st = R + e.uniToStrPos(ut.slice(R), L);
            return ct = ut.slice(R, st), R = st, ct;
          }
        } else {
          if (L === -1 || N === "d" || t.dlen(ut.d) - R <= L)
            return ct = { d: u(ut.d, R) }, ++v, R = 0, ct;
          {
            let st = u(ut.d, R, R + L);
            return R += L, { d: st };
          }
        }
      }, peek: () => E[v] };
    }, d = (E) => (E.length > 0 && typeof E[E.length - 1] == "number" && E.pop(), E);
    function h(E, v, R) {
      if (R !== "left" && R !== "right")
        throw Error("side (" + R + ") must be 'left' or 'right'");
      n(E), n(v);
      const I = [], A = a(I), { take: L, peek: N } = c(E);
      for (let ct = 0; ct < v.length; ct++) {
        const st = v[ct];
        let K, dt;
        switch (typeof st) {
          case "number":
            for (K = st; K > 0; )
              dt = L(K, "i"), A(dt), typeof dt != "string" && (K -= l(dt));
            break;
          case "string":
            R === "left" && typeof N() == "string" && A(L(-1)), A(e.strPosToUni(st));
            break;
          case "object":
            for (K = t.dlen(st.d); K > 0; )
              switch (dt = L(K, "i"), typeof dt) {
                case "number":
                  K -= dt;
                  break;
                case "string":
                  A(dt);
                  break;
                case "object":
                  K -= t.dlen(dt.d);
              }
            break;
        }
      }
      let ut;
      for (; ut = L(-1); )
        A(ut);
      return d(I);
    }
    function f(E, v) {
      n(E), n(v);
      const R = [], I = a(R), { take: A } = c(E);
      for (let N = 0; N < v.length; N++) {
        const ut = v[N];
        let ct, st;
        switch (typeof ut) {
          case "number":
            for (ct = ut; ct > 0; )
              st = A(ct, "d"), I(st), typeof st != "object" && (ct -= l(st));
            break;
          case "string":
            I(ut);
            break;
          case "object":
            ct = t.dlen(ut.d);
            let K = 0;
            for (; K < ct; )
              switch (st = A(ct - K, "d"), typeof st) {
                case "number":
                  I({ d: u(ut.d, K, K + st) }), K += st;
                  break;
                case "string":
                  K += e.strPosToUni(st);
                  break;
                case "object":
                  I(st);
              }
            break;
        }
      }
      let L;
      for (; L = A(-1); )
        I(L);
      return d(R);
    }
    const p = (E, v) => {
      let R = 0;
      for (let I = 0; I < v.length && E > R; I++) {
        const A = v[I];
        switch (typeof A) {
          case "number": {
            R += A;
            break;
          }
          case "string":
            const L = e.strPosToUni(A);
            R += L, E += L;
            break;
          case "object":
            E -= Math.min(t.dlen(A.d), E - R);
            break;
        }
      }
      return E;
    }, g = (E, v) => typeof E == "number" ? p(E, v) : E.map((R) => p(R, v));
    function _(E, v, R) {
      return s(E, (I, A) => typeof I == "object" && typeof I.d == "number" ? { d: R.slice(v, A, A + I.d) } : I);
    }
    function C(E) {
      return s(E, (v) => {
        switch (typeof v) {
          case "object":
            if (typeof v.d == "number")
              throw Error("Cannot invert text op: Deleted characters missing from operation. makeInvertible must be called first.");
            return v.d;
          case "string":
            return { d: v };
          case "number":
            return v;
        }
      });
    }
    function S(E) {
      return s(E, (v) => typeof v == "object" && typeof v.d == "string" ? { d: e.strPosToUni(v.d) } : v);
    }
    function T(E) {
      let v = !0;
      return r(E, (R) => {
        typeof R == "object" && typeof R.d == "number" && (v = !1);
      }), v;
    }
    function w(E) {
      return {
        name: "text-unicode",
        uri: "http://sharejs.org/types/text-unicode",
        trim: d,
        normalize: o,
        checkOp: n,
        /** Create a new text snapshot.
         *
         * @param {string} initial - initial snapshot data. Optional. Defaults to ''.
         * @returns {Snap} Initial document snapshot object
         */
        create(v = "") {
          if (typeof v != "string")
            throw Error("Initial data must be a string");
          return E.create(v);
        },
        /** Apply an operation to a document snapshot
         */
        apply(v, R) {
          n(R);
          const I = E.builder(v);
          for (let A = 0; A < R.length; A++) {
            const L = R[A];
            switch (typeof L) {
              case "number":
                I.skip(L);
                break;
              case "string":
                I.append(L);
                break;
              case "object":
                I.del(t.dlen(L.d));
                break;
            }
          }
          return I.build();
        },
        transform: h,
        compose: f,
        transformPosition: p,
        transformSelection: g,
        isInvertible: T,
        makeInvertible(v, R) {
          return _(v, R, E);
        },
        stripInvertible: S,
        invert: C,
        invertWithDoc(v, R) {
          return C(_(v, R, E));
        },
        isNoop: (v) => v.length === 0
      };
    }
    t.default = w;
  }(li)), li;
}
var Kr = {}, El;
function Tm() {
  if (El) return Kr;
  El = 1, Object.defineProperty(Kr, "__esModule", { value: !0 });
  const t = Li(), e = Bo();
  function n(r, s) {
    return {
      // Returns the text content of the document
      get: r,
      // Returns the number of characters in the string
      getLength() {
        return r().length;
      },
      // Insert the specified text at the given position in the document
      insert(i, o, a) {
        const l = e.strPosToUni(r(), i);
        return s([l, o], a);
      },
      remove(i, o, a) {
        const l = e.strPosToUni(r(), i);
        return s([l, { d: o }], a);
      },
      // When you use this API, you should implement these two methods
      // in your editing context.
      //onInsert: function(pos, text) {},
      //onRemove: function(pos, removedLength) {},
      _onOp(i) {
        t.eachOp(i, (o, a, l) => {
          switch (typeof o) {
            case "string":
              this.onInsert && this.onInsert(l, o);
              break;
            case "object":
              const u = t.dlen(o.d);
              this.onRemove && this.onRemove(l, u);
          }
        });
      },
      onInsert: null,
      onRemove: null
    };
  }
  return Kr.default = n, n.provides = { text: !0 }, Kr;
}
var vl;
function Sm() {
  return vl || (vl = 1, function(t) {
    var e = Vt && Vt.__createBinding || (Object.create ? function(h, f, p, g) {
      g === void 0 && (g = p), Object.defineProperty(h, g, { enumerable: !0, get: function() {
        return f[p];
      } });
    } : function(h, f, p, g) {
      g === void 0 && (g = p), h[g] = f[p];
    }), n = Vt && Vt.__setModuleDefault || (Object.create ? function(h, f) {
      Object.defineProperty(h, "default", { enumerable: !0, value: f });
    } : function(h, f) {
      h.default = f;
    }), r = Vt && Vt.__importStar || function(h) {
      if (h && h.__esModule) return h;
      var f = {};
      if (h != null) for (var p in h) Object.hasOwnProperty.call(h, p) && e(f, h, p);
      return n(f, h), f;
    }, s = Vt && Vt.__importDefault || function(h) {
      return h && h.__esModule ? h : { default: h };
    };
    Object.defineProperty(t, "__esModule", { value: !0 }), t.type = t.remove = t.insert = void 0;
    const i = Bo(), o = r(Li()), a = s(Tm()), l = {
      create(h) {
        return h;
      },
      toString(h) {
        return h;
      },
      builder(h) {
        if (typeof h != "string")
          throw Error("Invalid document snapshot: " + h);
        const f = [];
        return {
          skip(p) {
            let g = i.uniToStrPos(h, p);
            if (g > h.length)
              throw Error("The op is too long for this document");
            f.push(h.slice(0, g)), h = h.slice(g);
          },
          append(p) {
            f.push(p);
          },
          del(p) {
            h = h.slice(i.uniToStrPos(h, p));
          },
          build() {
            return f.join("") + h;
          }
        };
      },
      slice: o.uniSlice
    }, u = o.default(l), c = Object.assign(Object.assign({}, u), { api: a.default });
    t.type = c, t.insert = (h, f) => f.length === 0 ? [] : h === 0 ? [f] : [h, f], t.remove = (h, f) => o.dlen(f) === 0 ? [] : h === 0 ? [{ d: f }] : [h, { d: f }];
    var d = Li();
    Object.defineProperty(t, "makeType", { enumerable: !0, get: function() {
      return d.default;
    } });
  }(ai)), ai;
}
(function(t) {
  var e = Vt && Vt.__importDefault || function(b) {
    return b && b.__esModule ? b : {
      default: b
    };
  };
  Object.defineProperty(t, "__esModule", {
    value: !0
  }), t.editOp = t.replaceOp = t.insertOp = t.moveOp = t.removeOp = t.type = void 0;
  const n = e(xo), r = e(Uo), s = Po, i = ko;
  function o(b, O) {
    if (!b) throw new Error(O);
  }
  t.type = {
    name: "json1",
    uri: "http://sharejs.org/types/JSONv1",
    readCursor: s.readCursor,
    writeCursor: s.writeCursor,
    create: (b) => b,
    isNoop: (b) => b == null,
    setDebug(b) {
    },
    registerSubtype: C,
    checkValidOp: A,
    normalize: L,
    apply: N,
    transformPosition: ut,
    compose: ct,
    tryTransform: Xt,
    transform: At,
    makeInvertible: dt,
    invert: st,
    invertWithDoc: lt,
    RM_UNEXPECTED_CONTENT: i.ConflictType.RM_UNEXPECTED_CONTENT,
    DROP_COLLISION: i.ConflictType.DROP_COLLISION,
    BLACKHOLE: i.ConflictType.BLACKHOLE,
    transformNoConflict: (b, O, U) => un(() => !0, b, O, U),
    typeAllowingConflictsPred: (b) => Object.assign(Object.assign({}, t.type), {
      transform: (O, U, W) => un(b, O, U, W)
    })
  };
  const a = (b) => b ? b.getComponent() : null;
  function l(b) {
    return b && typeof b == "object" && !Array.isArray(b);
  }
  const u = (b) => Array.isArray(b) ? b.slice() : b !== null && typeof b == "object" ? Object.assign({}, b) : b, c = (b) => b && (b.p != null || b.r !== void 0), d = (b) => b && (b.d != null || b.i !== void 0);
  function h(b, O) {
    return o(b != null), typeof O == "number" ? (o(Array.isArray(b), "Invalid key - child is not an array"), (b = b.slice()).splice(O, 1)) : (o(l(b), "Invalid key - child is not an object"), delete (b = Object.assign({}, b))[O]), b;
  }
  function f(b, O, U) {
    return typeof O == "number" ? (o(b != null, "Container is missing for key"), o(Array.isArray(b), "Cannot use numerical key for object container"), o(b.length >= O, "Cannot insert into out of bounds index"), b.splice(O, 0, U)) : (o(l(b), "Cannot insert into missing item"), o(b[O] === void 0, "Trying to overwrite value at key. Your op needs to remove it first"), b[O] = U), U;
  }
  t.removeOp = (b, O = !0) => s.writeCursor().writeAtPath(b, "r", O).get(), t.moveOp = (b, O) => s.writeCursor().writeMove(b, O).get(), t.insertOp = (b, O) => s.writeCursor().writeAtPath(b, "i", O).get(), t.replaceOp = (b, O, U) => s.writeCursor().at(b, (W) => {
    W.write("r", O), W.write("i", U);
  }).get(), t.editOp = (b, O, U, W = !1) => s.writeCursor().at(b, (k) => v(k, O, U, W)).get();
  const p = (b, O) => b != null && (typeof O == "number" ? Array.isArray(b) : typeof b == "object"), g = (b, O) => p(b, O) ? b[O] : void 0, _ = {};
  function C(b) {
    let O = b.type ? b.type : b;
    O.name && (_[O.name] = O), O.uri && (_[O.uri] = O);
  }
  const S = (b) => {
    const O = _[b];
    if (O) return O;
    throw Error("Missing type: " + b);
  };
  C(Sm());
  const T = (b, O) => b + O;
  C({
    name: "number",
    apply: T,
    compose: T,
    invert: (b) => -b,
    transform: (b) => b
  });
  const w = (b) => b == null ? null : b.et ? S(b.et) : b.es ? _["text-unicode"] : b.ena != null ? _.number : null, E = (b) => b.es ? b.es : b.ena != null ? b.ena : b.e, v = (b, O, U, W = !1) => {
    const [k, $] = typeof O == "string" ? [S(O), O] : [O, O.name];
    !W && k.isNoop && k.isNoop(U) || ($ === "number" ? b.write("ena", U) : $ === "text-unicode" ? b.write("es", U) : (b.write("et", $), b.write("e", U)));
  };
  function R(b) {
    o(typeof b == "number"), o(b >= 0), o(b === (0 | b));
  }
  function I(b) {
    typeof b == "number" ? R(b) : o(typeof b == "string");
  }
  function A(b) {
    if (b === null) return;
    const O = /* @__PURE__ */ new Set(), U = /* @__PURE__ */ new Set(), W = ($) => {
      let et = !0, J = !1;
      for (let D in $) {
        const F = $[D];
        if (et = !1, o(D === "p" || D === "r" || D === "d" || D === "i" || D === "e" || D === "es" || D === "ena" || D === "et", "Invalid component item '" + D + "'"), D === "p") R(F), o(!O.has(F)), O.add(F), o($.r === void 0);
        else if (D === "d") R(F), o(!U.has(F)), U.add(F), o($.i === void 0);
        else if (D === "e" || D === "es" || D === "ena") {
          o(!J), J = !0;
          const P = w($);
          o(P, "Missing type in edit"), P.checkValidOp && P.checkValidOp(E($));
        }
      }
      o(!et);
    }, k = ($, et, J) => {
      if (!Array.isArray($)) throw Error("Op must be null or a list");
      if ($.length === 0) throw Error("Empty descent");
      et || I($[0]);
      let D = 1, F = 0, P = 0;
      for (let H = 0; H < $.length; H++) {
        const q = $[H];
        if (o(q != null), Array.isArray(q)) {
          const it = k(q, !1);
          if (F) {
            const M = typeof P, Q = typeof it;
            M === Q ? o(P < it, "descent keys are not in order") : o(M === "number" && Q === "string");
          }
          P = it, F++, D = 3;
        } else typeof q == "object" ? (o(D === 1, `Prev not scalar - instead ${D}`), W(q), D = 2) : (o(D !== 3), I(q), o(s.isValidPathItem(q), "Invalid path key"), D = 1);
      }
      return o(F !== 1, "Operation makes multiple descents. Remove some []"), o(D === 2 || D === 3), $[0];
    };
    k(b, !0), o(O.size === U.size, "Mismatched picks and drops in op");
    for (let $ = 0; $ < O.size; $++) o(O.has($)), o(U.has($));
  }
  function L(b) {
    let O = 0, U = [];
    const W = s.writeCursor();
    return W.mergeTree(b, (k, $) => {
      const et = w(k);
      if (et) {
        const D = E(k);
        v($, et, et.normalize ? et.normalize(D) : D);
      }
      for (const D of ["r", "p", "i", "d"]) if (k[D] !== void 0) {
        const F = D === "p" || D === "d" ? (J = k[D], U[J] == null && (U[J] = O++), U[J]) : k[D];
        $.write(D, F);
      }
      var J;
    }), W.get();
  }
  function N(b, O) {
    if (A(O), O === null) return b;
    const U = [];
    return function W(k, $) {
      let et = k, J = 0, D = {
        root: k
      }, F = 0, P = D, H = "root";
      function q() {
        for (; F < J; F++) {
          let it = $[F];
          typeof it != "object" && (o(p(P, H)), P = P[H] = u(P[H]), H = it);
        }
      }
      for (; J < $.length; J++) {
        const it = $[J];
        if (Array.isArray(it)) {
          const M = W(et, it);
          M !== et && M !== void 0 && (q(), et = P[H] = M);
        } else if (typeof it == "object") {
          it.d != null ? (q(), et = f(P, H, U[it.d])) : it.i !== void 0 && (q(), et = f(P, H, it.i));
          const M = w(it);
          if (M) q(), et = P[H] = M.apply(et, E(it));
          else if (it.e !== void 0) throw Error("Subtype " + it.et + " undefined");
        } else et = g(et, it);
      }
      return D.root;
    }(b = function W(k, $) {
      const et = [];
      let J = 0;
      for (; J < $.length; J++) {
        const H = $[J];
        if (Array.isArray(H)) break;
        typeof H != "object" && (et.push(k), k = g(k, H));
      }
      for (let H = $.length - 1; H >= J; H--) k = W(k, $[H]);
      for (--J; J >= 0; J--) {
        const H = $[J];
        if (typeof H != "object") {
          const q = et.pop();
          k = k === g(q, H) ? q : k === void 0 ? h(q, H) : (F = H, P = k, (D = u(D = q))[F] = P, D);
        } else c(H) && (o(k !== void 0, "Cannot pick up or remove undefined"), H.p != null && (U[H.p] = k), k = void 0);
      }
      var D, F, P;
      return k;
    }(b, O), O);
  }
  function ut(b, O) {
    b = b.slice(), A(O);
    const U = s.readCursor(O);
    let W, k, $ = !1;
    const et = [];
    for (let D = 0; ; D++) {
      const F = b[D], P = U.getComponent();
      if (P && (P.r !== void 0 ? $ = !0 : P.p != null && ($ = !1, W = P.p, k = D)), D >= b.length) break;
      let H = 0;
      const q = s.advancer(U, void 0, (M, Q) => {
        c(Q) && H++;
      });
      et.unshift(q);
      const it = q(F);
      if (typeof F == "number" && (b[D] -= H), !it) break;
    }
    if (et.forEach((D) => D.end()), $) return null;
    const J = () => {
      let D = 0;
      if (W != null) {
        const F = U.getPath();
        D = F.length, b = F.concat(b.slice(k));
      }
      for (; D < b.length; D++) {
        const F = b[D], P = a(U), H = w(P);
        if (H) {
          const M = E(P);
          H.transformPosition && (b[D] = H.transformPosition(b[D], M));
          break;
        }
        let q = 0;
        const it = s.advancer(U, (M, Q) => d(Q) ? ~(M - q) : M - q, (M, Q) => {
          d(Q) && q++;
        })(F);
        if (typeof F == "number" && (b[D] += q), !it) break;
      }
    };
    return W != null ? U.eachDrop(null, (D) => {
      D === W && J();
    }) : J(), b;
  }
  function ct(b, O) {
    if (A(b), A(O), b == null) return O;
    if (O == null) return b;
    let U = 0;
    const W = s.readCursor(b), k = s.readCursor(O), $ = s.writeCursor(), et = [], J = [], D = [], F = [], P = [], H = [], q = /* @__PURE__ */ new Set();
    W.traverse(null, (M) => {
      M.p != null && (D[M.p] = W.clone());
    }), k.traverse(null, (M) => {
      M.d != null && (F[M.d] = k.clone());
    });
    const it = s.writeCursor();
    return function M(Q, Dt, It, mt, Pt, qe, ue, Zt) {
      o(Dt || It);
      const kt = a(Dt), Ie = a(It), Pe = !!Ie && Ie.r !== void 0, vn = !!kt && kt.i !== void 0, Te = kt ? kt.d : null, Ee = Ie ? Ie.p : null, tn = (qe || Pe) && Ee == null;
      if (Ee != null) mt = F[Ee], ue = J[Ee] = new s.WriteCursor();
      else if (Ie && Ie.r !== void 0) mt = null;
      else {
        const G = a(mt);
        G && G.d != null && (mt = null);
      }
      const Rt = a(mt);
      if (Te != null) if (Q = D[Te], Zt = et[Te] = new s.WriteCursor(), tn) qe && !Pe && Zt.write("r", !0);
      else {
        const G = P[Te] = U++;
        ue.write("d", G);
      }
      else if (kt && kt.i !== void 0) Q = null;
      else {
        const G = a(Q);
        G && G.p != null && (Q = null);
      }
      let Y;
      vn ? (o(Pt === void 0), Y = kt.i) : Y = Pt;
      const ht = (Ee == null ? !vn || qe || Pe : Y === void 0) ? null : ue.getComponent();
      if (Ee != null) {
        if (!(Pt !== void 0 || vn)) {
          const G = Te != null ? P[Te] : U++;
          H[Ee] = G, Zt.write("p", G);
        }
      } else Pe && (vn || Pt !== void 0 || (Ie.r, Zt.write("r", Ie.r)));
      const X = tn ? null : w(kt), V = w(Rt);
      if ((X || V) && (X && X.name, V && V.name), X && V) {
        o(X === V);
        const G = E(kt), pt = E(Rt), zt = X.compose(G, pt);
        v(ue, X, zt), q.add(Rt);
      } else X ? v(ue, X, E(kt)) : V && (v(ue, V, E(Rt)), q.add(Rt));
      const Z = typeof Y == "object" && Y != null;
      let Ct = !1, vt = 0, bt = 0, Yt = 0, jt = 0, Bt = 0;
      const re = s.advancer(mt, (G, pt) => d(pt) ? jt - G - 1 : G - jt, (G, pt) => {
        d(pt) && jt++;
      }), yt = s.advancer(Q, (G, pt) => c(pt) ? vt - G - 1 : G - vt, (G, pt) => {
        c(pt) && vt++;
      });
      if (s.eachChildOf(Dt, It, (G, pt, zt) => {
        let he, en, Cn = G, ke = G, cr = G;
        if (typeof G == "number") {
          let qt = G + Yt;
          en = re(qt), ke = qt + jt;
          let Ht = G + bt;
          he = yt(Ht), d(a(en)) && (he = null), Cn = Ht + vt, cr = G + Bt, o(Cn >= 0, "p1PickKey is negative"), o(ke >= 0, "p2DropKey is negative");
          const Be = d(a(pt)), nn = c(a(zt));
          (Be || nn && !tn) && Bt--, Be && bt--, nn && Yt--;
        } else he = yt(G), en = re(G);
        Zt.descend(Cn), ue.descend(ke);
        const Fn = Z && !d(a(pt)) ? Y[cr] : void 0, We = M(he, pt, zt, en, Fn, tn, ue, Zt);
        var Ve, tt, Lt;
        Z && !tn ? Fn !== We && (Ct || (Y = Array.isArray(Y) ? Y.slice() : Object.assign({}, Y), Ct = !0), Ve = Y, Lt = We, typeof (tt = cr) == "number" ? (o(Array.isArray(Ve)), o(tt < Ve.length)) : (o(!Array.isArray(Ve)), o(Ve[tt] !== void 0)), Lt === void 0 ? typeof tt == "number" ? Ve.splice(tt, 1) : delete Ve[tt] : Ve[tt] = Lt) : o(We === void 0), ue.ascend(), Zt.ascend();
      }), yt.end(), re.end(), ht != null) ht.i = Y;
      else if (!qe && !Pe && Ee == null) return Y;
    }(W, W.clone(), k, k.clone(), void 0, !1, $, it), $.reset(), $.mergeTree(it.get()), $.reset(), $.get(), et.map((M) => M.get()), J.map((M) => M.get()), W.traverse($, (M, Q) => {
      const Dt = M.p;
      if (Dt != null) {
        const It = P[Dt];
        It != null && Q.write("p", It);
        const mt = et[Dt];
        mt && mt.get(), mt && Q.mergeTree(mt.get());
      } else M.r !== void 0 && Q.write("r", M.r);
    }), $.reset(), $.get(), k.traverse($, (M, Q) => {
      const Dt = M.d;
      if (Dt != null) {
        const mt = H[Dt];
        mt != null && Q.write("d", mt);
        const Pt = J[Dt];
        Pt && Q.mergeTree(Pt.get());
      } else M.i !== void 0 && Q.write("i", M.i);
      const It = w(M);
      It && !q.has(M) && v(Q, It, E(M));
    }), $.get();
  }
  function st(b) {
    if (b == null) return null;
    const O = new s.ReadCursor(b), U = new s.WriteCursor();
    let W;
    const k = [], $ = [];
    return function et(J, D, F) {
      const P = J.getComponent();
      let H, q = !1;
      if (P) {
        P.p != null && (D.write("d", P.p), k[P.p] = J.clone()), P.r !== void 0 && D.write("i", P.r), P.d != null && (D.write("p", P.d), F = void 0), P.i !== void 0 && (F = H = P.i);
        const M = w(P);
        M && (F === void 0 ? (W || (W = /* @__PURE__ */ new Set()), W.add(P)) : (E(P), F = M.apply(F, E(P)), q = !0));
      }
      let it = 0;
      for (const M of J) {
        D.descend(M);
        const Q = typeof M == "number" ? M - it : M, Dt = g(F, Q);
        d(J.getComponent()) && it++;
        const It = et(J, D, Dt);
        if (F !== void 0 && It !== void 0) {
          if (q || (q = !0, F = u(F)), !p(F, Q)) throw Error("Cannot modify child - invalid operation");
          F[Q] = It;
        }
        D.ascend();
      }
      if (H === void 0) return q ? F : void 0;
      D.write("r", F);
    }(O, U, void 0), W && (U.reset(), function et(J, D, F) {
      const P = D.getComponent();
      if (P) {
        const M = P.d;
        if (M != null && (J = k[M], F = $[M] = s.writeCursor()), W.has(P)) {
          const Q = w(P);
          if (!Q.invert) throw Error(`Cannot invert subtype ${Q.name}`);
          v(F, Q, Q.invert(E(P)));
        }
      }
      let H = 0, q = 0;
      const it = s.advancer(J, (M, Q) => c(Q) ? H - M - 1 : M - H, (M, Q) => {
        c(Q) && H++;
      });
      for (const M of D) if (typeof M == "number") {
        const Q = M - q, Dt = it(Q), It = Q + H;
        F.descend(It), et(Dt, D, F), d(D.getComponent()) && q++, F.ascend();
      } else F.descend(M), et(it(M), D, F), F.ascend();
      it.end();
    }(O.clone(), O, U), $.length && (U.reset(), O.traverse(U, (et, J) => {
      const D = et.p;
      if (D != null) {
        const F = $[D];
        F && F.get(), F && J.mergeTree(F.get());
      }
    }))), U.get();
  }
  const K = (b, O) => b.some((U) => typeof U == "object" && (Array.isArray(U) ? K(U, O) : O(U)));
  function dt(b, O) {
    if (b == null || !K(b, (D) => {
      var F;
      return D.r !== void 0 || ((F = w(D)) === null || F === void 0 ? void 0 : F.makeInvertible) != null;
    })) return b;
    const U = new s.ReadCursor(b), W = new s.WriteCursor();
    let k = !1;
    const $ = [], et = [], J = (D, F, P) => {
      const H = D.getComponent();
      let q = !1;
      if (H) {
        H.d != null && F.write("d", H.d), H.i !== void 0 && F.write("i", H.i);
        const M = H.p;
        if (M != null && ($[M] = D.clone(), o(P !== void 0, "Operation picks up at an invalid key"), et[M] = P, F.write("p", H.p)), H.r !== void 0 && P === void 0) throw Error("Invalid doc / op in makeInvertible: removed item missing from doc");
        const Q = w(H);
        Q && (Q.makeInvertible ? k = !0 : v(F, Q, E(H), !0));
      }
      let it = 0;
      for (const M of D) {
        F.descend(M);
        const Q = typeof M == "number" ? M - it : M, Dt = g(P, Q), It = J(D, F, Dt);
        Dt !== It && (q || (q = !0, P = u(P)), It === void 0 ? (P = h(P, Q), typeof M == "number" && it++) : P[Q] = It), F.ascend();
      }
      return H && (H.r !== void 0 ? (F.write("r", r.default(P)), P = void 0) : H.p != null && (P = void 0)), P;
    };
    return J(U, W, O), W.get(), k && (W.reset(), function D(F, P, H, q, it) {
      const M = P.getComponent();
      if (M) {
        M.i !== void 0 ? (q = M.i, it = !0) : M.d != null && (q = et[M.d], F = $[M.d], it = !1, M.d);
        let mt = w(M);
        if (mt && mt.makeInvertible) {
          const Pt = E(M);
          v(H, mt, mt.makeInvertible(Pt, q), !0);
        }
      }
      let Q = 0, Dt = 0;
      const It = s.advancer(F, (mt, Pt) => c(Pt) ? Q - mt - 1 : mt - Q, (mt, Pt) => {
        c(Pt) && Q++;
      });
      for (const mt of P) if (typeof mt == "number") {
        const Pt = mt - Dt, qe = It(Pt), ue = Pt + Q, Zt = g(q, it ? Pt : ue);
        H.descend(mt), D(qe, P, H, Zt, it), d(P.getComponent()) && Dt++, H.ascend();
      } else {
        const Pt = g(q, mt);
        H.descend(mt), D(It(mt), P, H, Pt, it), H.ascend();
      }
      It.end();
    }(U.clone(), U, W, O, !1)), W.get();
  }
  function lt(b, O) {
    return st(dt(b, O));
  }
  const rt = (b) => {
    if (b == null) return null;
    const O = b.slice();
    for (let U = 0; U < b.length; U++) {
      const W = O[U];
      Array.isArray(W) && (O[U] = rt(W));
    }
    return O;
  };
  function Xt(b, O, U) {
    o(U === "left" || U === "right", "Direction must be left or right");
    const W = U === "left" ? 0 : 1;
    if (O == null) return {
      ok: !0,
      result: b
    };
    A(b), A(O);
    let k = null;
    const $ = [], et = [], J = [], D = [], F = [], P = [], H = [], q = [], it = [], M = [], Q = [], Dt = [], It = [], mt = [], Pt = [];
    let qe = 0;
    const ue = s.readCursor(b), Zt = s.readCursor(O), kt = s.writeCursor();
    if (function Rt(Y, ht = null, X) {
      const V = a(ht);
      V && (V.r !== void 0 ? X = ht.clone() : V.p != null && (X = null, P[V.p] = Y.clone()));
      const Z = Y.getComponent();
      let Ct;
      Z && (Ct = Z.p) != null && (F[Ct] = ht ? ht.clone() : null, J[Ct] = Y.clone(), X && (M[Ct] = !0, it[Ct] = X), V && V.p != null && (mt[Ct] = V.p));
      const vt = s.advancer(ht);
      for (const bt of Y) Rt(Y, vt(bt), X);
      vt.end();
    }(Zt, ue, null), function Rt(Y, ht, X, V, Z) {
      const Ct = X.getComponent();
      let vt, bt = !1;
      Ct && ((vt = Ct.d) != null ? (D[vt] = X.clone(), V != null && (Pt[V] == null && (Pt[V] = []), Pt[V].push(vt)), M[vt], Y = F[vt] || null, ht = J[vt] || null, M[vt] ? (Z && (Q[vt] = !0), Z = it[vt] || null) : !Z || W !== 1 && mt[vt] != null || k == null && (k = {
        type: i.ConflictType.RM_UNEXPECTED_CONTENT,
        op1: t.removeOp(Z.getPath()),
        op2: t.moveOp(ht.getPath(), X.getPath())
      }), bt = !0) : Ct.i !== void 0 && (Y = ht = null, bt = !0, Z && k == null && (k = {
        type: i.ConflictType.RM_UNEXPECTED_CONTENT,
        op1: t.removeOp(Z.getPath()),
        op2: t.insertOp(X.getPath(), Ct.i)
      })));
      const Yt = a(Y);
      Yt && (Yt.r !== void 0 ? Z = Y.clone() : Yt.p != null && (Yt.p, V = Yt.p, Z = null));
      const jt = w(Ct);
      jt && Z && k == null && (k = {
        type: i.ConflictType.RM_UNEXPECTED_CONTENT,
        op1: t.removeOp(Z.getPath()),
        op2: t.editOp(X.getPath(), jt, E(Ct), !0)
      });
      let Bt = 0, re = 0;
      const yt = s.advancer(ht, (pt, zt) => c(zt) ? Bt - pt - 1 : pt - Bt, (pt, zt) => {
        c(zt) && Bt++;
      }), G = s.advancer(Y);
      for (const pt of X) if (typeof pt == "number") {
        const zt = pt - re, he = yt(zt);
        re += +Rt(G(zt + Bt), he, X, V, Z);
      } else {
        const zt = yt(pt);
        Rt(G(pt), zt, X, V, Z);
      }
      return yt.end(), G.end(), bt;
    }(ue, Zt, Zt.clone(), null, null), D.map((Rt) => Rt && Rt.get()), k) return {
      ok: !1,
      conflict: k
    };
    Q.map((Rt) => !!Rt);
    const Ie = [];
    let Pe = null;
    (function Rt(Y, ht, X, V, Z) {
      let Ct = !1;
      const vt = a(ht);
      if (c(vt)) {
        const yt = vt.p;
        yt != null ? (X = D[yt], V = Dt[yt] = s.writeCursor(), Ct = !0, Z = null) : (X = null, Z = ht.clone());
      } else d(a(X)) && (X = null);
      const bt = Y.getComponent();
      if (bt) {
        const yt = bt.p;
        yt != null ? (Z && (q[yt] = Z), Ie[yt] = Z || W === 1 && Ct ? null : V.getComponent(), $[yt] = Y.clone(), X && (H[yt] = X.clone())) : bt.r !== void 0 && (Z || V.write("r", !0), (Z || Ct) && (Pe == null && (Pe = /* @__PURE__ */ new Set()), Pe.add(bt)));
      }
      let Yt = 0, jt = 0;
      const Bt = s.advancer(ht, void 0, (yt, G) => {
        c(G) && Yt++;
      }), re = s.advancer(X, (yt, G) => d(G) ? ~(yt - jt) : yt - jt, (yt, G) => {
        d(G) && jt++;
      });
      if (Y) for (const yt of Y) if (typeof yt == "string") {
        const G = Bt(yt), pt = re(yt);
        V.descend(yt), Rt(Y, G, pt, V, Z), V.ascend();
      } else {
        const G = Bt(yt), pt = yt - Yt, zt = c(a(G)) ? null : re(pt), he = pt + jt;
        o(he >= 0), V.descend(he), Rt(Y, G, zt, V, Z), V.ascend();
      }
      Bt.end(), re.end();
    })(ue, Zt, Zt.clone(), kt, null), kt.reset();
    let vn = [];
    if (function Rt(Y, ht, X, V, Z, Ct) {
      o(ht);
      const vt = ht.getComponent();
      let bt = a(V), Yt = !1;
      const jt = (tt, Lt, qt) => tt ? t.moveOp(tt.getPath(), Lt.getPath()) : t.insertOp(Lt.getPath(), qt.i);
      if (d(vt)) {
        const tt = vt.d;
        tt != null && (et[tt] = ht.clone());
        const Lt = tt != null ? Ie[tt] : null;
        let qt = !1;
        if (vt.i !== void 0 || tt != null && Lt) {
          let Ht;
          bt && (bt.i !== void 0 || (Ht = bt.d) != null && !M[Ht]) && (qt = Ht != null ? tt != null && tt === mt[Ht] : n.default(bt.i, vt.i), qt || Ht != null && W !== 1 && mt[Ht] != null || k == null && (k = {
            type: i.ConflictType.DROP_COLLISION,
            op1: jt(tt != null ? $[tt] : null, ht, vt),
            op2: jt(Ht != null ? J[Ht] : null, V, bt)
          })), qt || (Ct ? k == null && (k = {
            type: i.ConflictType.RM_UNEXPECTED_CONTENT,
            op1: jt(tt != null ? $[tt] : null, ht, vt),
            op2: t.removeOp(Ct.getPath())
          }) : (tt != null ? (vn[qe] = tt, Z.write("d", Lt.p = qe++)) : Z.write("i", r.default(vt.i)), Yt = !0));
        } else if (tt != null && !Lt) {
          const Ht = q[tt];
          Ht && (Ct = Ht.clone());
        }
        tt != null ? (Y = $[tt], X = P[tt], V = H[tt]) : vt.i !== void 0 && (Y = X = null, qt || (V = null));
      } else c(a(Y)) && (Y = X = V = null);
      const Bt = a(Y), re = a(X);
      if (c(re)) {
        const tt = re.p;
        re.r !== void 0 && (!Bt || Bt.r === void 0) || M[tt] ? (V = null, Ct = X.clone()) : tt != null && (V = D[tt], W !== 1 && mt[tt] != null || ((Z = It[tt]) || (Z = It[tt] = s.writeCursor()), Z.reset(), Ct = null));
      } else !d(vt) && d(bt) && (V = null);
      bt = V != null ? V.getComponent() : null;
      const yt = w(vt);
      if (yt) {
        const tt = E(vt);
        if (Ct) k == null && (k = {
          type: i.ConflictType.RM_UNEXPECTED_CONTENT,
          op1: t.editOp(ht.getPath(), yt, tt, !0),
          op2: t.removeOp(Ct.getPath())
        });
        else {
          const Lt = w(bt);
          let qt;
          if (Lt) {
            if (yt !== Lt) throw Error("Transforming incompatible types");
            const Ht = E(bt);
            qt = yt.transform(tt, Ht, U);
          } else qt = r.default(tt);
          v(Z, yt, qt);
        }
      }
      let G = 0, pt = 0, zt = 0, he = 0, en = 0, Cn = 0, ke = Y != null && Y.descendFirst(), cr = ke;
      const Fn = s.advancer(X, void 0, (tt, Lt) => {
        c(Lt) && zt++;
      });
      let We = V != null && V.descendFirst(), Ve = We;
      for (const tt of ht) if (typeof tt == "number") {
        let Lt;
        const qt = d(ht.getComponent()), Ht = tt - pt;
        {
          let cn;
          for (; ke && typeof (cn = Y.getKey()) == "number"; ) {
            cn += G;
            const He = Y.getComponent(), Un = c(He);
            if (cn > Ht || cn === Ht && (!Un || W === 0 && qt)) break;
            if (Un) {
              G--;
              const Rn = He.p;
              mt.includes(Rn), He.d, a(It[He.d]), c(a(It[He.d])), (He.r === void 0 || Pe && Pe.has(He)) && (Rn == null || !Ie[Rn] || W !== 1 && mt.includes(Rn)) || en--;
            }
            ke = Y.nextSibling();
          }
          Lt = ke && cn === Ht ? Y : null;
        }
        const Be = Ht - G;
        let nn = Fn(Be);
        const ei = Be - zt;
        let Vr = null;
        {
          let cn, He;
          for (; We && typeof (cn = V.getKey()) == "number"; ) {
            He = cn - he;
            const Un = V.getComponent(), Rn = d(Un);
            if (He > ei) break;
            if (He === ei) {
              if (!Rn) {
                Vr = V;
                break;
              }
              {
                if (W === 0 && qt) {
                  Vr = V;
                  break;
                }
                const dn = nn && c(nn.getComponent());
                if (W === 0 && dn) break;
              }
            }
            if (Rn) {
              const dn = Un.d;
              M[dn], mt[dn], Un.i === void 0 && (M[dn] || mt[dn] != null && W !== 1) ? (M[dn] || mt[dn] != null && W === 0) && (he++, Cn--) : he++;
            }
            We = V.nextSibling();
          }
        }
        const Fa = ei + he + en + Cn;
        o(Fa >= 0, "trying to descend to a negative index"), Z.descend(Fa), qt && (Lt = nn = Vr = null, pt++), Rt(Lt, ht, nn, Vr, Z, Ct) && Cn++, Z.ascend();
      } else {
        let Lt;
        for (; ke && (Lt = Y.getKey(), typeof Lt != "string" || !(Lt > tt || Lt === tt)); ) ke = Y.nextSibling();
        const qt = ke && Lt === tt ? Y : null, Ht = Fn(tt);
        let Be;
        for (; We && (Be = V.getKey(), typeof Be != "string" || !(Be > tt || Be === tt)); ) We = V.nextSibling();
        const nn = We && Be === tt ? V : null;
        Z.descend(tt), Rt(qt, ht, Ht, nn, Z, Ct), Z.ascend();
      }
      return Fn.end(), cr && Y.ascend(), Ve && V.ascend(), Yt;
    }(ue, ue.clone(), Zt, Zt.clone(), kt, null), k) return {
      ok: !1,
      conflict: k
    };
    kt.reset();
    const Te = (Rt, Y, ht) => Rt.traverse(Y, (X, V) => {
      X.d != null && ht(X.d, Rt, V);
    });
    (M.length || Dt.length) && (Te(Zt, kt, (Rt, Y, ht) => {
      M[Rt] && !Q[Rt] && ht.write("r", !0), Dt[Rt] && ht.mergeTree(Dt[Rt].get());
    }), kt.reset());
    const Ee = [], tn = [];
    if ((It.length || M.length) && !k) {
      const Rt = s.readCursor(rt(kt.get()));
      if (Te(Rt, null, (Y, ht) => {
        Ee[Y] = ht.clone();
      }), It.forEach((Y) => {
        Y && Te(s.readCursor(Y.get()), null, (ht, X) => {
          Ee[ht] = X.clone();
        });
      }), function Y(ht, X, V, Z, Ct, vt) {
        const bt = a(X);
        if (bt && c(bt)) if (bt.p != null) {
          const G = bt.p;
          Ee[G].getPath(), V = Ee[G], Z = tn[G] = s.writeCursor();
        } else bt.r !== void 0 && (V = null);
        else d(a(V)) && (V = null);
        const Yt = ht.getComponent();
        if (Yt) {
          let G;
          if ((G = Yt.d) != null) {
            const pt = It[G];
            pt && (pt.get(), Z.mergeTree(pt.get()), V = s.readCursor(pt.get()));
          }
        }
        let jt = 0, Bt = 0;
        const re = s.advancer(X, void 0, (G, pt) => {
          c(pt) && jt--;
        }), yt = s.advancer(V, (G, pt) => d(pt) ? -(G - Bt) - 1 : G - Bt, (G, pt) => {
          d(pt) && Bt++;
        });
        for (const G of ht) if (typeof G == "number") {
          const pt = re(G), zt = G + jt, he = yt(zt), en = zt + Bt;
          Z.descend(en), Y(ht, pt, he, Z), Z.ascend();
        } else Z.descend(G), Y(ht, re(G), yt(G), Z), Z.ascend();
        re.end(), yt.end();
      }(Zt, Rt, Rt.clone(), kt), kt.reset(), k) return {
        ok: !1,
        conflict: k
      };
      if (kt.get(), tn.length) {
        const Y = tn.map((X) => X ? X.get() : null), ht = s.readCursor(rt(kt.get()));
        if (Te(ht, kt, (X, V, Z) => {
          const Ct = Y[X];
          Ct && (Z.mergeTree(Ct), Y[X] = null);
        }), Y.find((X) => X)) {
          const X = s.writeCursor(), V = s.writeCursor();
          let Z = 0, Ct = 0;
          Y.forEach((vt) => {
            vt != null && Te(s.readCursor(vt), null, (bt) => {
              const Yt = vn[bt];
              X.writeMove($[Yt].getPath(), et[Yt].getPath(), Z++);
              const jt = Pt[Yt];
              jt && jt.forEach((Bt) => {
                M[Bt] || W !== 1 && mt[Bt] != null || V.writeMove(J[Bt].getPath(), D[Bt].getPath(), Ct++);
              });
            });
          }), k = {
            type: i.ConflictType.BLACKHOLE,
            op1: X.get(),
            op2: V.get()
          };
        }
      }
    }
    return k ? {
      ok: !1,
      conflict: k
    } : {
      ok: !0,
      result: kt.get()
    };
  }
  const _t = (b) => {
    const O = new Error("Transform detected write conflict");
    throw O.conflict = b, O.type = O.name = "writeConflict", O;
  };
  function At(b, O, U) {
    const W = Xt(b, O, U);
    if (W.ok) return W.result;
    _t(W.conflict);
  }
  const Jt = (b) => {
    const O = s.writeCursor();
    return s.readCursor(b).traverse(O, (U, W) => {
      (d(U) || w(U)) && W.write("r", !0);
    }), O.get();
  }, le = (b, O) => {
    const { type: U, op1: W, op2: k } = b;
    switch (U) {
      case i.ConflictType.DROP_COLLISION:
        return O === "left" ? [null, Jt(k)] : [Jt(W), null];
      case i.ConflictType.RM_UNEXPECTED_CONTENT:
        let $ = !1;
        return s.readCursor(W).traverse(null, (et) => {
          et.r !== void 0 && ($ = !0);
        }), $ ? [null, Jt(k)] : [Jt(W), null];
      case i.ConflictType.BLACKHOLE:
        return [Jt(W), Jt(k)];
      default:
        throw Error("Unrecognised conflict: " + U);
    }
  };
  function un(b, O, U, W) {
    let k = null;
    for (; ; ) {
      const $ = Xt(O, U, W);
      if ($.ok) return ct(k, $.result);
      {
        const { conflict: et } = $;
        b(et) || _t(et);
        const [J, D] = le(et, W);
        O = ct(L(O), J), U = ct(L(U), D), k = ct(k, D);
      }
    }
  }
})(mc);
(function(t) {
  var e = Vt && Vt.__createBinding || (Object.create ? function(i, o, a, l) {
    l === void 0 && (l = a), Object.defineProperty(i, l, { enumerable: !0, get: function() {
      return o[a];
    } });
  } : function(i, o, a, l) {
    l === void 0 && (l = a), i[l] = o[a];
  }), n = Vt && Vt.__exportStar || function(i, o) {
    for (var a in i) a !== "default" && !o.hasOwnProperty(a) && e(o, i, a);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(mc, t);
  var r = Po;
  Object.defineProperty(t, "ReadCursor", { enumerable: !0, get: function() {
    return r.ReadCursor;
  } }), Object.defineProperty(t, "WriteCursor", { enumerable: !0, get: function() {
    return r.WriteCursor;
  } });
  var s = ko;
  Object.defineProperty(t, "ConflictType", { enumerable: !0, get: function() {
    return s.ConflictType;
  } });
})(fe);
const wm = /* @__PURE__ */ Je(fe), Mv = /* @__PURE__ */ Jd({
  __proto__: null,
  default: wm
}, [fe]), yr = 2, Er = 2 ** 2, vs = 2 ** 3, vr = 2 ** 4, Cr = 2 ** 5, Rr = 2 ** 6, xi = 2 ** 7, Fi = 2 ** 8, Ui = 2 ** 9, Om = 0, Am = 2958466, Nm = -694324, Dm = 35830291, Mm = -1, Cl = 1, zn = 6, Ho = "general", jo = "hash", Kn = "zero", $o = "qmark", Wo = "slash", Ur = "group", Ns = "scale", Vo = "comma", Go = "break", Ws = "text", Yo = "plus", zo = "minus", Ds = "point", Ko = "space", Xo = "percent", Vs = "digit", Qo = "calendar", Pr = "error", Jo = "datetime", Zo = "duration", qo = "condition", ta = "dbnum", ea = "natnum", na = "locale", ra = "color", _c = "modifier", sa = "ampm", ia = "escaped", oa = "string", aa = "skip", la = "exp", ua = "fill", ca = "paren", Gs = "char", Lm = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#800080",
  "#008080",
  "#C0C0C0",
  "#808080",
  "#9999FF",
  "#993366",
  "#FFFFCC",
  "#CCFFFF",
  "#660066",
  "#FF8080",
  "#0066CC",
  "#CCCCFF",
  "#000080",
  "#FF00FF",
  "#FFFF00",
  "#00FFFF",
  "#800080",
  "#800000",
  "#008080",
  "#0000FF",
  "#00CCFF",
  "#CCFFFF",
  "#CCFFCC",
  "#FFFF99",
  "#99CCFF",
  "#FF99CC",
  "#CC99FF",
  "#FFCC99",
  "#3366FF",
  "#33CCCC",
  "#99CC00",
  "#FFCC00",
  "#FF9900",
  "#FF6600",
  "#666699",
  "#969696",
  "#003366",
  "#339966",
  "#003300",
  "#333300",
  "#993300",
  "#993366",
  "#333399",
  "#333333"
], Pi = [
  "¤",
  "$",
  "£",
  "¥",
  "֏",
  "؋",
  "৳",
  "฿",
  "៛",
  "₡",
  "₦",
  "₩",
  "₪",
  "₫",
  "€",
  "₭",
  "₮",
  "₱",
  "₲",
  "₴",
  "₸",
  "₹",
  "₺",
  "₼",
  "₽",
  "₾",
  "₿"
], ki = new RegExp("[" + Pi.join("") + "]"), ui = Object.freeze({
  1078: "af",
  // Afrikaans
  1052: "sq",
  // Albanian
  1118: "am",
  // Amharic
  5121: "ar_DZ",
  // Arabic - Algeria
  15361: "ar_BH",
  // Arabic - Bahrain
  3073: "ar_EG",
  // Arabic - Egypt
  2049: "ar_IQ",
  // Arabic - Iraq
  11265: "ar_JO",
  // Arabic - Jordan
  13313: "ar_KW",
  // Arabic - Kuwait
  12289: "ar_LB",
  // Arabic - Lebanon
  4097: "ar_LY",
  // Arabic - Libya
  6145: "ar_MA",
  // Arabic - Morocco
  8193: "ar_OM",
  // Arabic - Oman
  16385: "ar_QA",
  // Arabic - Qatar
  1025: "ar_SA",
  // Arabic - Saudi Arabia
  10241: "ar_SY",
  // Arabic - Syria
  7169: "ar_TN",
  // Arabic - Tunisia
  14337: "ar_AE",
  // Arabic - United Arab Emirates
  9217: "ar_YE",
  // Arabic - Yemen
  1067: "hy",
  // Armenian
  1101: "as",
  // Assamese
  2092: "az_AZ",
  // Azeri - Cyrillic
  1068: "az_AZ",
  // Azeri - Latin
  1069: "eu",
  // Basque
  1059: "be",
  // Belarusian
  2117: "bn",
  // Bengali - Bangladesh
  1093: "bn_IN",
  // Bengali - India
  5146: "bs",
  // Bosnian
  1026: "bg",
  // Bulgarian
  1109: "my",
  // Burmese
  1027: "ca",
  // Catalan
  2052: "zh_CN",
  // Chinese - China
  3076: "zh_HK",
  // Chinese - Hong Kong SAR
  5124: "zh_MO",
  // Chinese - Macau SAR
  4100: "zh_SG",
  // Chinese - Singapore
  1028: "zh_TW",
  // Chinese - Taiwan
  1050: "hr",
  // Croatian
  1029: "cs",
  // Czech
  1030: "da",
  // Danish
  1125: "dv",
  // Divehi; Dhivehi; Maldivian
  2067: "nl_BE",
  // Dutch - Belgium
  1043: "nl_NL",
  // Dutch - Netherlands
  1126: "bin",
  // Edo
  3081: "en_AU",
  // English - Australia
  10249: "en_BZ",
  // English - Belize
  4105: "en_CA",
  // English - Canada
  9225: "en_CB",
  // English - Caribbean
  2057: "en_GB",
  // English - Great Britain
  16393: "en_IN",
  // English - India
  6153: "en_IE",
  // English - Ireland
  8201: "en_JM",
  // English - Jamaica
  5129: "en_NZ",
  // English - New Zealand
  13321: "en_PH",
  // English - Phillippines
  7177: "en_ZA",
  // English - Southern Africa
  11273: "en_TT",
  // English - Trinidad
  1033: "en_US",
  // English - United States
  12297: "en_ZW",
  // English - Zimbabwe
  1061: "et",
  // Estonian
  1071: "mk",
  // FYRO Macedonia
  1080: "fo",
  // Faroese
  1065: "fa",
  // Farsi - Persian
  1124: "fil",
  // Filipino
  1035: "fi",
  // Finnish
  2060: "fr_BE",
  // French - Belgium
  11276: "fr_CM",
  // French - Cameroon
  3084: "fr_CA",
  // French - Canada
  9228: "fr_CG",
  // French - Congo
  12300: "fr_CI",
  // French - Cote d'Ivoire
  1036: "fr_FR",
  // French - France
  5132: "fr_LU",
  // French - Luxembourg
  13324: "fr_ML",
  // French - Mali
  6156: "fr_MC",
  // French - Monaco
  14348: "fr_MA",
  // French - Morocco
  10252: "fr_SN",
  // French - Senegal
  4108: "fr_CH",
  // French - Switzerland
  7180: "fr",
  // French - West Indies
  1122: "fy_NL",
  // Frisian - Netherlands
  2108: "gd_IE",
  // Gaelic - Ireland
  1084: "gd",
  // Gaelic - Scotland
  1110: "gl",
  // Galician
  1079: "ka",
  // Georgian
  3079: "de_AT",
  // German - Austria
  1031: "de_DE",
  // German - Germany
  5127: "de_LI",
  // German - Liechtenstein
  4103: "de_LU",
  // German - Luxembourg
  2055: "de_CH",
  // German - Switzerland
  1032: "el",
  // Greek
  1140: "gn",
  // Guarani - Paraguay
  1095: "gu",
  // Gujarati
  1279: "en",
  // HID (Human Interface Device)
  1037: "he",
  // Hebrew
  1081: "hi",
  // Hindi
  1038: "hu",
  // Hungarian
  1039: "is",
  // Icelandic
  1136: "ig_NG",
  // Igbo - Nigeria
  1057: "id",
  // Indonesian
  1040: "it_IT",
  // Italian - Italy
  2064: "it_CH",
  // Italian - Switzerland
  1041: "ja",
  // Japanese
  1099: "kn",
  // Kannada
  1120: "ks",
  // Kashmiri
  1087: "kk",
  // Kazakh
  1107: "km",
  // Khmer
  1111: "kok",
  // Konkani
  1042: "ko",
  // Korean
  1088: "ky",
  // Kyrgyz - Cyrillic
  1108: "lo",
  // Lao
  1142: "la",
  // Latin
  1062: "lv",
  // Latvian
  1063: "lt",
  // Lithuanian
  2110: "ms_BN",
  // Malay - Brunei
  1086: "ms_MY",
  // Malay - Malaysia
  1100: "ml",
  // Malayalam
  1082: "mt",
  // Maltese
  1112: "mni",
  // Manipuri
  1153: "mi",
  // Maori
  1102: "mr",
  // Marathi
  1104: "mn",
  // Mongolian
  2128: "mn",
  // Mongolian
  1121: "ne",
  // Nepali
  1044: "no_NO",
  // Norwegian - Bokml
  2068: "no_NO",
  // Norwegian - Nynorsk
  1096: "or",
  // Oriya
  1045: "pl",
  // Polish
  1046: "pt_BR",
  // Portuguese - Brazil
  2070: "pt_PT",
  // Portuguese - Portugal
  1094: "pa",
  // Punjabi
  1047: "rm",
  // Raeto-Romance
  2072: "ro_MO",
  // Romanian - Moldova
  1048: "ro_RO",
  // Romanian - Romania
  1049: "ru",
  // Russian
  2073: "ru_MO",
  // Russian - Moldova
  1083: "se",
  // Sami Lappish
  1103: "sa",
  // Sanskrit
  3098: "sr_SP",
  // Serbian - Cyrillic
  2074: "sr_SP",
  // Serbian - Latin
  1072: "st",
  // Sesotho (Sutu)
  1074: "tn",
  // Setsuana
  1113: "sd",
  // Sindhi
  1115: "si",
  // Sinhala; Sinhalese
  1051: "sk",
  // Slovak
  1060: "sl",
  // Slovenian
  1143: "so",
  // Somali
  1070: "sb",
  // Sorbian
  11274: "es_AR",
  // Spanish - Argentina
  16394: "es_BO",
  // Spanish - Bolivia
  13322: "es_CL",
  // Spanish - Chile
  9226: "es_CO",
  // Spanish - Colombia
  5130: "es_CR",
  // Spanish - Costa Rica
  7178: "es_DO",
  // Spanish - Dominican Republic
  12298: "es_EC",
  // Spanish - Ecuador
  17418: "es_SV",
  // Spanish - El Salvador
  4106: "es_GT",
  // Spanish - Guatemala
  18442: "es_HN",
  // Spanish - Honduras
  2058: "es_MX",
  // Spanish - Mexico
  19466: "es_NI",
  // Spanish - Nicaragua
  6154: "es_PA",
  // Spanish - Panama
  15370: "es_PY",
  // Spanish - Paraguay
  10250: "es_PE",
  // Spanish - Peru
  20490: "es_PR",
  // Spanish - Puerto Rico
  1034: "es_ES",
  // Spanish - Spain (Traditional)
  14346: "es_UY",
  // Spanish - Uruguay
  8202: "es_VE",
  // Spanish - Venezuela
  1089: "sw",
  // Swahili
  2077: "sv_FI",
  // Swedish - Finland
  1053: "sv_SE",
  // Swedish - Sweden
  1114: "syc",
  // Syriac
  1064: "tg",
  // Tajik
  1097: "ta",
  // Tamil
  1092: "tt",
  // Tatar
  1098: "te",
  // Telugu
  1054: "th",
  // Thai
  1105: "bo",
  // Tibetan
  1073: "ts",
  // Tsonga
  1055: "tr",
  // Turkish
  1090: "tk",
  // Turkmen
  1058: "uk",
  // Ukrainian
  1056: "ur",
  // Urdu
  2115: "uz_UZ",
  // Uzbek - Cyrillic
  1091: "uz_UZ",
  // Uzbek - Latin
  1075: "ve",
  // Venda
  1066: "vi",
  // Vietnamese
  1106: "cy",
  // Welsh
  1076: "xh",
  // Xhosa
  1085: "yi",
  // Yiddish
  1077: "zu"
  // Zulu
}), yc = /^([a-z\d]+)(?:[_-]([a-z\d]+))?(?:\.([a-z\d]+))?(?:@([a-z\d]+))?$/i, Vn = {}, m = (t, e = "") => t.replace(/~/g, e).split(";"), Mt = (t, e = 0, n = 0) => (t.mmm || (t.mmm = e < 1 ? t.mmmm.concat() : t.mmmm.map((r) => {
  const s = r.slice(0, e % 10);
  return s + (e < 10 || r === s ? "" : ".");
})), t.ddd || (t.ddd = n < 1 ? t.dddd.concat() : t.dddd.map((r) => {
  const s = r.slice(0, n % 10);
  return s + (n < 10 || r === s ? "" : ".");
})), !t.mmm6 && t.mmmm6 && (t.mmm6 = t.mmmm6), t), xm = {
  group: " ",
  decimal: ".",
  positive: "+",
  negative: "-",
  percent: "%",
  exponent: "E",
  nan: "NaN",
  infinity: "∞",
  ampm: m("AM;PM"),
  mmmm6: m("Muharram;Safar;Rabiʻ I;Rabiʻ II;Jumada I;Jumada II;Rajab;Shaʻban;Ramadan;Shawwal;Dhuʻl-Qiʻdah;Dhuʻl-Hijjah"),
  mmm6: m("Muh.;Saf.;Rab. I;Rab. II;Jum. I;Jum. II;Raj.;Sha.;Ram.;Shaw.;Dhuʻl-Q.;Dhuʻl-H."),
  mmmm: m("January;February;March;April;May;June;July;August;September;October;November;December"),
  mmm: m("Jan;Feb;Mar;Apr;May;Jun;Jul;Aug;Sep;Oct;Nov;Dec"),
  dddd: m("Sunday;Monday;Tuesday;Wednesday;Thursday;Friday;Saturday"),
  ddd: m("Sun;Mon;Tue;Wed;Thu;Fri;Sat"),
  bool: m("TRUE;FALSE"),
  preferMDY: !1
};
function da(t) {
  const e = yc.exec(t);
  if (!e)
    throw new SyntaxError(`Malformed locale: ${t}`);
  return {
    lang: e[1] + (e[2] ? "_" + e[2] : ""),
    language: e[1],
    territory: e[2] || ""
  };
}
function ha(t) {
  if (typeof t == "number")
    return ui[t & 65535] || null;
  const e = parseInt(t, 16);
  return isFinite(e) && ui[e & 65535] ? ui[e & 65535] || null : yc.test(t) ? t : null;
}
function ar(t) {
  const e = ha(t);
  let n = null;
  if (e) {
    const r = da(e);
    n = Vn[r.lang] || Vn[r.language] || null;
  }
  return n;
}
function Bi(t) {
  return Object.assign({}, xm, t);
}
function B(t, e) {
  const n = typeof e == "object" ? e : da(e);
  return Vn[n.lang] = Bi(t), n.language !== n.lang && !Vn[n.language] && (Vn[n.language] = Bi(t)), Vn[n.lang];
}
const _n = Bi({ group: ",", preferMDY: !0 });
_n.isDefault = !0;
B({
  group: ",",
  ampm: m("上午;下午"),
  mmmm: m("一月;二月;三月;四月;五月;六月;七月;八月;九月;十月;十一月;十二月"),
  mmm: m("1月;2月;3月;4月;5月;6月;7月;8月;9月;10月;11月;12月"),
  dddd: m("~日;~一;~二;~三;~四;~五;~六", "星期"),
  ddd: m("周日;周一;周二;周三;周四;周五;周六")
}, "zh_CN");
const fa = {
  group: ",",
  ampm: m("上午;下午"),
  mmmm: m("1月;2月;3月;4月;5月;6月;7月;8月;9月;10月;11月;12月"),
  mmm: m("1月;2月;3月;4月;5月;6月;7月;8月;9月;10月;11月;12月"),
  dddd: m("~日;~一;~二;~三;~四;~五;~六", "星期"),
  ddd: m("周日;周一;周二;周三;周四;周五;周六")
};
B({
  ...fa,
  nan: "非數值",
  dddd: m("~日;~一;~二;~三;~四;~五;~六", "星期")
}, "zh_TW");
B({
  ...fa,
  dddd: m("~日;~一;~二;~三;~四;~五;~六", "星期")
}, "zh_HK");
B({
  ...fa,
  ampm: m("午前;午後"),
  dddd: m("日~;月~;火~;水~;木~;金~;土~", "曜日"),
  ddd: m("日;月;火;水;木;金;土")
}, "ja");
B({
  group: ",",
  ampm: m("오전;오후"),
  mmmm: m("1월;2월;3월;4월;5월;6월;7월;8월;9월;10월;11월;12월"),
  mmm: m("1월;2월;3월;4월;5월;6월;7월;8월;9월;10월;11월;12월"),
  dddd: m("일요일;월요일;화요일;수요일;목요일;금요일;토요일"),
  ddd: m("일;월;화;수;목;금;토")
}, "ko");
B({
  group: ",",
  ampm: m("ก่อนเที่ยง;หลังเที่ยง"),
  mmmm: m("มกร~;กุมภาพันธ์;มีน~;เมษายน;พฤษภ~;มิถุนายน;กรกฎ~;สิงห~;กันยายน;ตุล~;พฤศจิกายน;ธันว~", "าคม"),
  mmm: m("ม.ค.;ก.พ.;มี.ค.;เม.ย.;พ.ค.;มิ.ย.;ก.ค.;ส.ค.;ก.ย.;ต.ค.;พ.ย.;ธ.ค."),
  dddd: m("วันอาทิตย์;วันจันทร์;วันอังคาร;วันพุธ;วันพฤหัสบดี;วันศุกร์;วันเสาร์"),
  ddd: m("อา.;จ.;อ.;พ.;พฤ.;ศ.;ส.")
}, "th");
B(Mt({
  decimal: ",",
  ampm: m("dop.;odp."),
  mmmm: m("ledna;února;března;dubna;května;června;července;srpna;září;října;listopadu;prosince"),
  mmm: m("I;II;III;IV;V;VI;VII;VIII;IX;X;XI;XII"),
  dddd: m("neděle;pondělí;úterý;středa;čtvrtek;pátek;sobota"),
  bool: m("PRAVDA;NEPRAVDA")
}, -1, 2), "cs");
B(Mt({
  group: ".",
  decimal: ",",
  mmmm: m("januar;februar;marts;april;maj;juni;juli;august;september;oktober;november;december"),
  dddd: m("søn~;man~;tirs~;ons~;tors~;fre~;lør~", "dag"),
  bool: m("SAND;FALSK")
}, 13, 13), "da");
B(Mt({
  group: ".",
  decimal: ",",
  ampm: m("a.m.;p.m."),
  mmmm: m("januari;februari;maart;april;mei;juni;juli;augustus;september;oktober;november;december"),
  mmm: m("jan.;feb.;mrt.;apr.;mei;jun.;jul.;aug.;sep.;okt.;nov.;dec."),
  dddd: m("zondag;maandag;dinsdag;woensdag;donderdag;vrijdag;zaterdag"),
  bool: m("WAAR;ONWAAR")
}, -1, 2), "nl");
B({ group: ",", preferMDY: !0 }, "en");
B({ group: ",", preferMDY: !0 }, "en_US");
B({ group: "," }, "en_AU");
B({ group: "," }, "en_CA");
B({ group: "," }, "en_GB");
B({ group: ",", mmm: m("Jan;Feb;Mar;Apr;May;Jun;Jul;Aug;Sept;Oct;Nov;Dec") }, "en_IE");
B(Mt({
  decimal: ",",
  nan: "epäluku",
  ampm: m("ap.;ip."),
  mmmm: m("tammi~;helmi~;maalis~;huhti~;touko~;kesä~;heinä~;elo~;syys~;loka~;marras~;joulu~", "kuuta"),
  mmm: m("tammik.;helmik.;maalisk.;huhtik.;toukok.;kesäk.;heinäk.;elok.;syysk.;lokak.;marrask.;jouluk."),
  dddd: m("sunnun~;maanan~;tiis~;keskiviikkona;tors~;perjan~;lauan~", "taina"),
  bool: m("TOSI;EPÄTOSI")
}, -1, 2), "fi");
const pa = Mt({
  group: " ",
  decimal: ",",
  mmmm: m("janvier;février;mars;avril;mai;juin;juillet;août;septembre;octobre;novembre;décembre"),
  mmm: m("janv.;févr.;mars;avr.;mai;juin;juil.;août;sept.;oct.;nov.;déc."),
  dddd: m("~manche;lun~;mar~;mercre~;jeu~;vendre~;same~", "di"),
  bool: m("VRAI;FAUX")
}, -1, 13);
B({ ...pa }, "fr");
B({ ...pa, mmm: m("janv.;févr.;mars;avr.;mai;juin;juill.;août;sept.;oct.;nov.;déc.") }, "fr_CA");
B({ group: "'", decimal: ".", ...pa }, "fr_CH");
const Ec = Mt({
  mmmm: m("Januar;Februar;März;April;Mai;Juni;Juli;August;September;Oktober;November;Dezember"),
  mmm: m("Jan.;Feb.;März;Apr.;Mai;Juni;Juli;Aug.;Sept.;Okt.;Nov.;Dez."),
  dddd: m("Sonn~;Mon~;Diens~;Mittwoch;Donners~;Frei~;Sams~", "tag"),
  bool: m("WAHR;FALSCH")
}, -1, 12);
B({ group: ".", decimal: ",", ...Ec }, "de");
B({ group: "'", decimal: ".", ...Ec }, "de_CH");
B(Mt({
  group: ".",
  decimal: ",",
  ampm: m("π.μ.;μ.μ."),
  mmmm: m("Ιανουαρ~;Φεβρουαρ~;Μαρτ~;Απριλ~;Μαΐου;Ιουν~;Ιουλ~;Αυγούστου;Σεπτεμβρ~;Οκτωβρ~;Νοεμβρ~;Δεκεμβρ~", "ίου"),
  mmm: m("Ιαν;Φεβ;Μαρ;Απρ;Μαΐ;Ιουν;Ιουλ;Αυγ;Σεπ;Οκτ;Νοε;Δεκ"),
  dddd: m("Κυριακή;Δευτέρα;Τρίτη;Τετάρτη;Πέμπτη;Παρασκευή;Σάββατο")
}, -1, 3), "el");
B({
  decimal: ",",
  ampm: m("de.;du."),
  mmmm: m("január;február;március;április;május;június;július;augusztus;szeptember;október;november;december"),
  mmm: m("jan.;febr.;márc.;ápr.;máj.;jún.;júl.;aug.;szept.;okt.;nov.;dec."),
  dddd: m("vasárnap;hétfő;kedd;szerda;csütörtök;péntek;szombat"),
  ddd: m("V;H;K;Sze;Cs;P;Szo"),
  bool: m("IGAZ;HAMIS")
}, "hu");
B(Mt({
  group: ".",
  decimal: ",",
  ampm: m("f.h.;e.h."),
  mmmm: m("janúar;febrúar;mars;apríl;maí;júní;júlí;ágúst;september;október;nóvember;desember"),
  dddd: m("sunnu~;mánu~;þriðju~;miðviku~;fimmtu~;föstu~;laugar~", "dagur")
}, 13, 13), "is");
B(Mt({
  group: ".",
  decimal: ",",
  mmmm: m("Januari;Februari;Maret;April;Mei;Juni;Juli;Agustus;September;Oktober;November;Desember"),
  dddd: m("Minggu;Senin;Selasa;Rabu;Kamis;Jumat;Sabtu")
}, 3, 3), "id");
const vc = Mt({
  mmmm: m("gennaio;febbraio;marzo;aprile;maggio;giugno;luglio;agosto;settembre;ottobre;novembre;dicembre"),
  dddd: m("domenica;lunedì;martedì;mercoledì;giovedì;venerdì;sabato"),
  bool: m("VERO;FALSO")
}, 3, 3);
B({ group: ".", decimal: ",", ...vc }, "it");
B({ group: "'", decimal: ".", ...vc }, "it_CH");
const Cc = {
  decimal: ",",
  ampm: m("a.m.;p.m."),
  mmmm: m("januar;februar;mars;april;mai;juni;juli;august;september;oktober;november;desember"),
  mmm: m("jan.;feb.;mar.;apr.;mai;jun.;jul.;aug.;sep.;okt.;nov.;des."),
  dddd: m("søn~;man~;tirs~;ons~;tors~;fre~;lør~", "dag"),
  bool: m("SANN;USANN")
};
B(Mt({ ...Cc }, -1, 13), "nb");
B(Mt({ ...Cc }, -1, 13), "no");
B(Mt({
  decimal: ",",
  mmmm: m("stycznia;lutego;marca;kwietnia;maja;czerwca;lipca;sierpnia;września;października;listopada;grudnia"),
  dddd: m("niedziela;poniedziałek;wtorek;środa;czwartek;piątek;sobota"),
  ddd: m("niedz.;pon.;wt.;śr.;czw.;pt.;sob."),
  bool: m("PRAWDA;FAŁSZ")
}, 3, -1), "pl");
const Rc = {
  group: ".",
  decimal: ",",
  mmmm: m("janeiro;fevereiro;março;abril;maio;junho;julho;agosto;setembro;outubro;novembro;dezembro"),
  dddd: m("domingo;segunda-feira;terça-feira;quarta-feira;quinta-feira;sexta-feira;sábado"),
  bool: m("VERDADEIRO;FALSO")
};
B(Mt(Rc, 13, 13), "pt");
B(Mt(Rc, 13, 13), "pt_BR");
B({
  decimal: ",",
  nan: "не число",
  mmmm: m("января;февраля;марта;апреля;мая;июня;июля;августа;сентября;октября;ноября;декабря"),
  mmm: m("янв.;февр.;мар.;апр.;мая;июн.;июл.;авг.;сент.;окт.;нояб.;дек."),
  dddd: m("воскресенье;понедельник;вторник;среда;четверг;пятница;суббота"),
  ddd: m("вс;пн;вт;ср;чт;пт;сб"),
  mmmm6: m("рамадан;шавваль;зуль-каада;зуль-хиджжа;мухаррам;раби-уль-авваль;раби-уль-ахир;джумад-уль-авваль;джумад-уль-ахир;раджаб;шаабан;рамадан"),
  mmm6: m("рам.;шав.;зуль-к.;зуль-х.;мух.;раб. I;раб. II;джум. I;джум. II;радж.;шааб.;рам."),
  bool: m("ИСТИНА;ЛОЖЬ")
}, "ru");
B(Mt({
  decimal: ",",
  mmmm: m("januára;februára;marca;apríla;mája;júna;júla;augusta;septembra;októbra;novembra;decembra"),
  dddd: m("nedeľa;pondelok;utorok;streda;štvrtok;piatok;sobota")
}, 3, 2), "sk");
const Ze = {
  group: ".",
  decimal: ",",
  ampm: m("a. m.;p. m."),
  mmmm: m("enero;febrero;marzo;abril;mayo;junio;julio;agosto;septiem~;octu~;noviem~;diciem~", "bre"),
  mmm: m("ene;feb;mar;abr;may;jun;jul;ago;sept;oct;nov;dic"),
  dddd: m("domingo;lunes;martes;miércoles;jueves;viernes;sábado"),
  ddd: m("dom;lun;mar;mié;jue;vie;sáb"),
  bool: m("VERDADERO;FALSO")
}, Fm = m("ene;feb;mar;abr;may;jun;jul;ago;sep;oct;nov;dic"), ga = m("ene.;feb.;mar.;abr.;may.;jun.;jul.;ago.;sept.;oct.;nov.;dic.");
B({ ...Ze }, "es");
B({ ...Ze }, "es_AR");
B({ ...Ze }, "es_BO");
B({ ...Ze }, "es_CL");
B({ ...Ze }, "es_CO");
B({ ...Ze }, "es_EC");
B({ ...Ze, mmm: Fm, ampm: m("a.m.;p.m.") }, "es_MX");
B({ ...Ze, mmm: ga }, "es_PY");
B({ ...Ze, mmm: ga }, "es_UY");
B({ ...Ze, mmm: ga, mmmm: m("enero;febrero;marzo;abril;mayo;junio;julio;agosto;setiembre;octubre;noviembre;diciembre") }, "es_VE");
B({
  decimal: ",",
  ampm: m("fm;em"),
  mmmm: m("januari;februari;mars;april;maj;juni;juli;augusti;september;oktober;november;december"),
  mmm: m("jan.;feb.;mars;apr.;maj;juni;juli;aug.;sep.;okt.;nov.;dec."),
  dddd: m("sön~;mån~;tis~;ons~;tors~;fre~;lör~", "dag"),
  ddd: m("sön;mån;tis;ons;tors;fre;lör")
}, "sv");
B(Mt({
  group: ".",
  decimal: ",",
  ampm: m("ÖÖ;ÖS"),
  mmmm: m("Ocak;Şubat;Mart;Nisan;Mayıs;Haziran;Temmuz;Ağustos;Eylül;Ekim;Kasım;Aralık"),
  mmm: m("Oca;Şub;Mar;Nis;May;Haz;Tem;Ağu;Eyl;Eki;Kas;Ara"),
  dddd: m("Pazar;Pazartesi;Salı;Çarşamba;Perşembe;Cuma;Cumartesi"),
  ddd: m("Paz;Pzt;Sal;Çar;Per;Cum;Cmt"),
  bool: m("DOĞRU;YANLIŞ")
}, 3, -1), "tr");
B({
  group: ",",
  ampm: m("yb;yh"),
  mmmm: m("Ionawr;Chwefror;Mawrth;Ebrill;Mai;Mehefin;Gorffennaf;Awst;Medi;Hydref;Tachwedd;Rhagfyr"),
  mmm: m("Ion;Chwef;Maw;Ebr;Mai;Meh;Gorff;Awst;Medi;Hyd;Tach;Rhag"),
  dddd: m("Dydd Sul;Dydd Llun;Dydd Mawrth;Dydd Mercher;Dydd Iau;Dydd Gwener;Dydd Sadwrn"),
  ddd: m("Sul;Llun;Maw;Mer;Iau;Gwen;Sad")
}, "cy");
B({
  group: ".",
  decimal: ",",
  mmmm: m("yanvar;fevral;mart;aprel;may;iyun;iyul;avqust;sentyabr;oktyabr;noyabr;dekabr"),
  mmm: m("yan;fev;mar;apr;may;iyn;iyl;avq;sen;okt;noy;dek"),
  dddd: m("bazar;bazar ertəsi;çərşənbə axşamı;çərşənbə;cümə axşamı;cümə;şənbə"),
  ddd: m("B.;B.e.;Ç.a.;Ç.;C.a.;C.;Ş.")
}, "az");
B(Mt({
  decimal: ",",
  mmmm: m("студзеня;лютага;сакавіка;красавіка;мая;чэрвеня;ліпеня;жніўня;верасня;кастрычніка;лістапада;снежня"),
  dddd: m("нядзеля;панядзелак;аўторак;серада;чацвер;пятніца;субота"),
  ddd: m("нд;пн;аў;ср;чц;пт;сб")
}, 3, -1), "be");
B({
  decimal: ",",
  ampm: m("пр.об.;сл.об."),
  mmmm: m("януари;февруари;март;април;май;юни;юли;август;септември;октомври;ноември;декември"),
  mmm: m("яну;фев;март;апр;май;юни;юли;авг;сеп;окт;ное;дек"),
  dddd: m("неделя;понеделник;вторник;сряда;четвъртък;петък;събота"),
  ddd: m("нд;пн;вт;ср;чт;пт;сб"),
  bool: m("ИСТИНА;ЛОЖЬ")
}, "bg");
B({
  group: ".",
  decimal: ",",
  mmmm: m("de gener;de febrer;de març;d’abril;de maig;de juny;de juliol;d’agost;de setembre;d’octubre;de novembre;de desembre"),
  mmm: m("de gen.;de febr.;de març;d’abr.;de maig;de juny;de jul.;d’ag.;de set.;d’oct.;de nov.;de des."),
  dddd: m("diumenge;dilluns;dimarts;dimecres;dijous;divendres;dissabte"),
  ddd: m("dg.;dl.;dt.;dc.;dj.;dv.;ds."),
  ampm: m("a. m.;p. m.")
}, "ca");
B(Mt({
  group: ",",
  decimal: ".",
  mmmm: m("Enero;Pebrero;Marso;Abril;Mayo;Hunyo;Hulyo;Agosto;Setyembre;Oktubre;Nobyembre;Disyembre"),
  dddd: m("Linggo;Lunes;Martes;Miyerkules;Huwebes;Biyernes;Sabado")
}, 3, 3), "fil");
B({
  group: ",",
  decimal: ".",
  mmmm: m("જાન્યુઆરી;ફેબ્રુઆરી;માર્ચ;એપ્રિલ;મે;જૂન;જુલાઈ;ઑગસ્ટ;સપ્ટેમ્બર;ઑક્ટોબર;નવેમ્બર;ડિસેમ્બર"),
  mmm: m("જાન્યુ;ફેબ્રુ;માર્ચ;એપ્રિલ;મે;જૂન;જુલાઈ;ઑગસ્ટ;સપ્ટે;ઑક્ટો;નવે;ડિસે"),
  dddd: m("રવિ~;સોમ~;મંગળ~;બુધ~;ગુરુ~;શુક્ર~;શનિ~", "વાર"),
  ddd: m("રવિ;સોમ;મંગળ;બુધ;ગુરુ;શુક્ર;શનિ")
}, "gu");
B({
  group: ",",
  decimal: ".",
  ampm: m("לפנה״צ;אחה״צ"),
  dddd: m("~ראשון;~שני;~שלישי;~רביעי;~חמישי;~שישי;~שבת", "יום "),
  ddd: m("~א׳;~ב׳;~ג׳;~ד׳;~ה׳;~ו׳;שבת", "יום "),
  mmmm: m("ינואר;פברואר;מרץ;אפריל;מאי;יוני;יולי;אוגוסט;ספטמבר;אוקטובר;נובמבר;דצמבר"),
  mmm: m("ינו׳;פבר׳;מרץ;אפר׳;מאי;יוני;יולי;אוג׳;ספט׳;אוק׳;נוב׳;דצמ׳"),
  mmmm6: m("רמדאן;שוואל;ד׳ו אל־קעדה;ד׳ו אל־חיג׳ה;מוחרם;רביע אל־אוול;רביע א־ת׳אני;ג׳ומאדא אל־אולא;ג׳ומאדא א־ת׳אניה;רג׳ב;שעבאן;רמדאן"),
  mmm6: m("רמדאן;שוואל;ד׳ו אל־קעדה;ד׳ו אל־חיג׳ה;מוחרם;רביע א׳;רביע ב׳;ג׳ומאדא א׳;ג׳ומאדא ב׳;רג׳ב;שעבאן;רמדאן")
}, "he");
B(Mt({
  group: ".",
  decimal: ",",
  mmmm: m("siječnja;veljače;ožujka;travnja;svibnja;lipnja;srpnja;kolovoza;rujna;listopada;studenoga;prosinca"),
  mmm: m("sij;velj;ožu;tra;svi;lip;srp;kol;ruj;lis;stu;pro"),
  dddd: m("nedjelja;ponedjeljak;utorak;srijeda;četvrtak;petak;subota")
}, -1, 3), "hr");
B({
  decimal: ",",
  mmmm: m("հունվարի;փետրվարի;մարտի;ապրիլի;մայիսի;հունիսի;հուլիսի;օգոստոսի;սեպտեմբերի;հոկտեմբերի;նոյեմբերի;դեկտեմբերի"),
  mmm: m("հնվ;փտվ;մրտ;ապր;մյս;հնս;հլս;օգս;սեպ;հոկ;նոյ;դեկ"),
  dddd: m("կիրակի;երկուշաբթի;երեքշաբթի;չորեքշաբթի;հինգշաբթի;ուրբաթ;շաբաթ"),
  ddd: m("կիր;երկ;երք;չրք;հնգ;ուր;շբթ")
}, "hy");
B(Mt({
  decimal: ",",
  mmmm: m("იანვარი;თებერვალი;მარტი;აპრილი;მაისი;ივნისი;ივლისი;აგვისტო;სექტემბერი;ოქტომბერი;ნოემბერი;დეკემბერი"),
  dddd: m("კვირა;ორშაბათი;სამშაბათი;ოთხშაბათი;ხუთშაბათი;პარასკევი;შაბათი")
}, 3, 3), "ka");
B(Mt({
  decimal: ",",
  mmmm: m("қаңтар;ақпан;наурыз;сәуір;мамыр;маусым;шілде;тамыз;қыркүйек;қазан;қараша;желтоқсан"),
  dddd: m("жексенбі;дүйсенбі;сейсенбі;сәрсенбі;бейсенбі;жұма;сенбі"),
  ddd: m("жс;дс;сс;ср;бс;жм;сб")
}, 13, -1), "kk");
B({
  group: ",",
  mmmm: m("ಜನವರಿ;ಫೆಬ್ರವರಿ;ಮಾರ್ಚ್;ಏಪ್ರಿಲ್;ಮೇ;ಜೂನ್;ಜುಲೈ;ಆಗಸ್ಟ್;ಸೆಪ್ಟೆಂಬರ್;ಅಕ್ಟೋಬರ್;ನವೆಂಬರ್;ಡಿಸೆಂಬರ್"),
  mmm: m("ಜನವರಿ;ಫೆಬ್ರವರಿ;ಮಾರ್ಚ್;ಏಪ್ರಿ;ಮೇ;ಜೂನ್;ಜುಲೈ;ಆಗಸ್ಟ್;ಸೆಪ್ಟೆಂ;ಅಕ್ಟೋ;ನವೆಂ;ಡಿಸೆಂ"),
  dddd: m("ಭಾನು~;ಸೋಮ~;ಮಂಗಳ~;ಬುಧ~;ಗುರು~;ಶುಕ್ರ~;ಶನಿ~", "ವಾರ"),
  ddd: m("ಭಾನು;ಸೋಮ;ಮಂಗಳ;ಬುಧ;ಗುರು;ಶುಕ್ರ;ಶನಿ"),
  ampm: m("ಪೂರ್ವಾಹ್ನ;ಅಪರಾಹ್ನ")
}, "kn");
B({
  decimal: ",",
  mmmm: m("sausio;vasario;kovo;balandžio;gegužės;birželio;liepos;rugpjūčio;rugsėjo;spalio;lapkričio;gruodžio"),
  mmm: m("saus.;vas.;kov.;bal.;geg.;birž.;liep.;rugp.;rugs.;spal.;lapkr.;gruod."),
  dddd: m("sekmadienis;pirmadienis;antradienis;trečiadienis;ketvirtadienis;penktadienis;šeštadienis"),
  ddd: m("sk;pr;an;tr;kt;pn;št"),
  ampm: m("priešpiet;popiet")
}, "lt");
B({
  decimal: ",",
  mmmm: m("janvāris;februāris;marts;aprīlis;maijs;jūnijs;jūlijs;augusts;septembris;oktobris;novembris;decembris"),
  mmm: m("janv.;febr.;marts;apr.;maijs;jūn.;jūl.;aug.;sept.;okt.;nov.;dec."),
  dddd: m("svētdiena;pirmdiena;otrdiena;trešdiena;ceturtdiena;piektdiena;sestdiena"),
  ddd: m("svētd.;pirmd.;otrd.;trešd.;ceturtd.;piektd.;sestd."),
  ampm: m("priekšpusdienā;pēcpusdienā")
}, "lv");
B({
  group: ",",
  decimal: ".",
  mmmm: m("ജനുവരി;ഫെബ്രുവരി;മാർച്ച്;ഏപ്രിൽ;മേയ്;ജൂൺ;ജൂലൈ;ഓഗസ്റ്റ്;സെപ്റ്റംബർ;ഒക്‌ടോബർ;നവംബർ;ഡിസംബർ"),
  mmm: m("ജനു;ഫെബ്രു;മാർ;ഏപ്രി;മേയ്;ജൂൺ;ജൂലൈ;ഓഗ;സെപ്റ്റം;ഒക്ടോ;നവം;ഡിസം"),
  dddd: m("ഞായറാഴ്‌ച;തിങ്കളാഴ്‌ച;ചൊവ്വാഴ്ച;ബുധനാഴ്‌ച;വ്യാഴാഴ്‌ച;വെള്ളിയാഴ്‌ച;ശനിയാഴ്‌ച"),
  ddd: m("ഞായർ;തിങ്കൾ;ചൊവ്വ;ബുധൻ;വ്യാഴം;വെള്ളി;ശനി")
}, "ml");
B({
  group: ",",
  decimal: ".",
  mmmm: m("нэгдүгээ~;хоёрдугаа~;гуравдугаа~;дөрөвдүгээ~;тавдугаа~;зургаадугаа~;долоодугаа~;наймдугаа~;есдүгээ~;аравдугаа~;арван нэгдүгээ~;арван хоёрдугаа~", "р сар"),
  mmm: m("1~;2~;3~;4~;5~;6~;7~;8~;9~;10~;11~;12~", "-р сар"),
  dddd: m("ням;даваа;мягмар;лхагва;пүрэв;баасан;бямба"),
  ddd: m("Ня;Да;Мя;Лх;Пү;Ба;Бя"),
  ampm: m("ү.ө.;ү.х.")
}, "mn");
B({
  group: ",",
  decimal: ".",
  mmmm: m("जानेवारी;फेब्रुवारी;मार्च;एप्रिल;मे;जून;जुलै;ऑगस्ट;सप्टेंबर;ऑक्टोबर;नोव्हेंबर;डिसेंबर"),
  mmm: m("जाने;फेब्रु;मार्च;एप्रि;मे;जून;जुलै;ऑग;सप्टें;ऑक्टो;नोव्हें;डिसें"),
  dddd: m("रविवार;सोमवार;मंगळवार;बुधवार;गुरुवार;शुक्रवार;शनिवार"),
  ddd: m("रवि;सोम;मंगळ;बुध;गुरु;शुक्र;शनि")
}, "mr");
B(Mt({
  group: ",",
  decimal: ".",
  mmmm: m("ဇန်နဝါရီ;ဖေဖော်ဝါရီ;မတ်;ဧပြီ;မေ;ဇွန်;ဇူလိုင်;ဩဂုတ်;စက်တင်ဘာ;အောက်တိုဘာ;နိုဝင်ဘာ;ဒီဇင်ဘာ"),
  mmm: m("ဇန်;ဖေ;မတ်;ဧ;မေ;ဇွန်;ဇူ;ဩ;စက်;အောက်;နို;ဒီ"),
  dddd: m("တနင်္ဂနွေ;တနင်္လာ;အင်္ဂါ;ဗုဒ္ဓဟူး;ကြာသပတေး;သောကြာ;စနေ"),
  ampm: m("နံနက်;ညနေ")
}, -1, 0), "my");
B({
  group: ",",
  decimal: ".",
  mmmm: m("ਜਨਵਰੀ;ਫ਼ਰਵਰੀ;ਮਾਰਚ;ਅਪ੍ਰੈਲ;ਮਈ;ਜੂਨ;ਜੁਲਾਈ;ਅਗਸਤ;ਸਤੰਬਰ;ਅਕਤੂਬਰ;ਨਵੰਬਰ;ਦਸੰਬਰ"),
  mmm: m("ਜਨ;ਫ਼ਰ;ਮਾਰਚ;ਅਪ੍ਰੈ;ਮਈ;ਜੂਨ;ਜੁਲਾ;ਅਗ;ਸਤੰ;ਅਕਤੂ;ਨਵੰ;ਦਸੰ"),
  dddd: m("ਐਤਵਾਰ;ਸੋਮਵਾਰ;ਮੰਗਲਵਾਰ;ਬੁੱਧਵਾਰ;ਵੀਰਵਾਰ;ਸ਼ੁੱਕਰਵਾਰ;ਸ਼ਨਿੱਚਰਵਾਰ"),
  ddd: m("ਐਤ;ਸੋਮ;ਮੰਗਲ;ਬੁੱਧ;ਵੀਰ;ਸ਼ੁੱਕਰ;ਸ਼ਨਿੱਚਰ"),
  ampm: m("ਪੂ.ਦੁ.;ਬਾ.ਦੁ.")
}, "pa");
B({
  group: ".",
  decimal: ",",
  mmmm: m("ianuarie;februarie;martie;aprilie;mai;iunie;iulie;august;septem~;octom~;noiem~;decem~", "brie"),
  mmm: m("ian.;feb.;mar.;apr.;mai;iun.;iul.;aug.;sept.;oct.;nov.;dec."),
  dddd: m("duminică;luni;marți;miercuri;joi;vineri;sâmbătă"),
  ddd: m("dum.;lun.;mar.;mie.;joi;vin.;sâm."),
  ampm: m("a.m.;p.m.")
}, "ro");
B(Mt({
  group: ".",
  decimal: ",",
  mmmm: m("januar;februar;marec;april;maj;junij;julij;avgust;september;oktober;november;december"),
  mmm: m("jan.;feb.;mar.;apr.;maj;jun.;jul.;avg.;sep.;okt.;nov.;dec."),
  dddd: m("nedelja;ponedeljek;torek;sreda;četrtek;petek;sobota"),
  ampm: m("dop.;pop.")
}, -1, 13), "sl");
B(Mt({
  group: ".",
  decimal: ",",
  mmmm: m("јануар;фебруар;март;април;мај;јун;јул;август;септембар;октобар;новембар;децембар"),
  dddd: m("недеља;понедељак;уторак;среда;четвртак;петак;субота")
}, 3, 3), "sr");
B({
  group: ",",
  decimal: ".",
  mmmm: m("ஜனவரி;பிப்ரவரி;மார்ச்;ஏப்ரல்;மே;ஜூன்;ஜூலை;ஆகஸ்ட்;செப்டம்பர்;அக்டோபர்;நவம்பர்;டிசம்பர்"),
  mmm: m("ஜன.;பிப்.;மார்.;ஏப்.;மே;ஜூன்;ஜூலை;ஆக.;செப்.;அக்.;நவ.;டிச."),
  dddd: m("ஞாயிறு;திங்கள்;செவ்வாய்;புதன்;வியாழன்;வெள்ளி;சனி"),
  ddd: m("ஞாயி.;திங்.;செவ்.;புத.;வியா.;வெள்.;சனி")
}, "ta");
B({
  group: ",",
  decimal: ".",
  mmmm: m("జనవరి;ఫిబ్రవరి;మార్చి;ఏప్రిల్;మే;జూన్;జులై;ఆగస్టు;సెప్టెంబర్;అక్టోబర్;నవంబర్;డిసెంబర్"),
  mmm: m("జన;ఫిబ్ర;మార్చి;ఏప్రి;మే;జూన్;జులై;ఆగ;సెప్టెం;అక్టో;నవం;డిసెం"),
  dddd: m("ఆదివారం;సోమవారం;మంగళవారం;బుధవారం;గురువారం;శుక్రవారం;శనివారం"),
  ddd: m("ఆది;సోమ;మంగళ;బుధ;గురు;శుక్ర;శని")
}, "te");
B({
  decimal: ",",
  mmmm: m("січня;лютого;березня;квітня;травня;червня;липня;серпня;вересня;жовтня;листопада;грудня"),
  mmm: m("січ.;лют.;бер.;квіт.;трав.;черв.;лип.;серп.;вер.;жовт.;лист.;груд."),
  dddd: m("неділю;понеділок;вівторок;середу;четвер;пʼятницю;суботу"),
  ddd: m("нд;пн;вт;ср;чт;пт;сб"),
  ampm: m("дп;пп")
}, "uk");
B({
  group: ".",
  decimal: ",",
  mmmm: m("~1;~2;~3;~4;~5;~6;~7;~8;~9;~10;~11;~12", "tháng "),
  mmm: m("~1;~2;~3;~4;~5;~6;~7;~8;~9;~10;~11;~12", "thg "),
  dddd: m("Chủ Nhật;Thứ Hai;Thứ Ba;Thứ Tư;Thứ Năm;Thứ Sáu;Thứ Bảy"),
  ddd: m("CN;Th 2;Th 3;Th 4;Th 5;Th 6;Th 7"),
  ampm: m("SA;CH")
}, "vi");
B(Mt({
  group: "٬",
  decimal: "٫",
  ampm: m("ص;م"),
  mmmm: m("يناير;فبراير;مارس;أبريل;مايو;يونيو;يوليو;أغسطس;سبتمبر;أكتوبر;نوفمبر;ديسمبر"),
  dddd: m("الأحد;الاثنين;الثلاثاء;الأربعاء;الخميس;الجمعة;السبت"),
  mmmm6: m("رمضان;شوال;ذو القعدة;ذو الحجة;محرم;ربيع الأول;ربيع الآخرة;جمادى الأولى;جمادى الآخرة;رجب;شعبان;رمضان")
}, 0, 0), "ar");
B({
  group: ",",
  decimal: ".",
  mmmm: m("জানুয়ারী;ফেব্রুয়ারী;মার্চ;এপ্রিল;মে;জুন;জুলাই;আগস্ট;সেপ্টেম্বর;অক্টোবর;নভেম্বর;ডিসেম্বর"),
  mmm: m("জানু;ফেব;মার্চ;এপ্রি;মে;জুন;জুল;আগ;সেপ্টেঃ;অক্টোঃ;নভেঃ;ডিসেঃ"),
  dddd: m("রবিবার;সোমবার;মঙ্গলবার;বুধবার;বৃহস্পতিবার;শুক্রবার;শনিবার"),
  ddd: m("রবি;সোম;মঙ্গল;বুধ;বৃহস্পতি;শুক্র;শনি")
}, "bn");
B({
  group: ",",
  decimal: ".",
  mmmm: m("जनवरी;फ़रवरी;मार्च;अप्रैल;मई;जून;जुलाई;अगस्त;सितंबर;अक्तूबर;नवंबर;दिसंबर"),
  mmm: m("जन॰;फ़र॰;मार्च;अप्रैल;मई;जून;जुल॰;अग॰;सित॰;अक्तू॰;नव॰;दिस॰"),
  dddd: m("रविवार;सोमवार;मंगलवार;बुधवार;गुरुवार;शुक्रवार;शनिवार"),
  ddd: m("रवि;सोम;मंगल;बुध;गुरु;शुक्र;शनि"),
  ampm: m("am;pm")
}, "hi");
const bc = {
  // Overflow error string
  overflow: "######",
  // dateErrorThrow needs to be off! [prev in locale]
  // Should it throw when there is an overflow error?
  dateErrorThrows: !1,
  // Should it emit a number when date has an overflow error? (Sheets does this)
  dateErrorNumber: !0,
  // dateErrorThrow needs to be off!
  // Should it emit a number when bigint has an is an overflow error?
  bigintErrorNumber: !1,
  // Sheets mode (see #3)
  dateSpanLarge: !0,
  // Simulate the Lotus 1-2-3 leap year bug
  leap1900: !0,
  // Emit regular vs. non-breaking spaces
  nbsp: !1,
  // Robust/throw mode
  throws: !0,
  // What is emitted when robust mode fails to parse (###### currently)
  invalid: "######",
  // Locale
  locale: "",
  // Don't adjust dates to UTC when converting them to serial time
  ignoreTimezone: !1,
  // Integer digit grouping
  grouping: [3, 3],
  // resolve indexed colors to hex
  indexColors: !0,
  // Skip-next signifier character
  skipChar: "",
  // Repear-next signifier character
  repeatChar: ""
};
function Ne(t, e = 0) {
  if (typeof t != "number")
    return t;
  if (t < 0)
    return -Ne(-t, e);
  if (e) {
    const n = 10 ** e || 1;
    return Ne(t * n, 0) / n;
  }
  return Math.round(t);
}
const Um = 1e-13;
function Ic(t, e = 2, n = 2) {
  const r = t < 0 ? -1 : 1, s = 10 ** (e || 2), i = 10 ** (n || 2);
  let o = Math.abs(t), a = 0, l = 0, u = 0, c = 1, d, h;
  if (t = o, t % 1 === 0)
    h = [t * r, 1];
  else if (t < 1e-19)
    h = [r, 1e19];
  else if (t > 1e19)
    h = [1e19 * r, 1];
  else {
    do
      if (o = 1 / (o - Math.floor(o)), d = c, c = c * Math.floor(o) + a, a = d, l = u, u = Math.floor(t * c + 0.5), u >= s || c >= i)
        return [r * l, a];
    while (Math.abs(t - u / c) >= Um && o !== Math.floor(o));
    h = [r * u, c];
  }
  return h;
}
const Ce = Math.floor;
function Tc(t, e = !0) {
  if (e && t >= 0) {
    if (t === 0)
      return [1900, 1, 0];
    if (t === 60)
      return [1900, 2, 29];
    if (t < 60)
      return [1900, t < 32 ? 1 : 2, (t - 1) % 31 + 1];
  }
  let n = t + 68569 + 2415019;
  const r = Ce(4 * n / 146097);
  n = n - Ce((146097 * r + 3) / 4);
  const s = Ce(4e3 * (n + 1) / 1461001);
  n = n - Ce(1461 * s / 4) + 31;
  const i = Ce(80 * n / 2447), o = n - Ce(2447 * i / 80);
  n = Ce(i / 11);
  const a = i + 2 - 12 * n;
  return [100 * (r - 49) + s + n | 0, a | 0, o | 0];
}
function Pm(t) {
  return Tc(t + 1462);
}
function km(t) {
  if (t === 60)
    throw new Error("#VALUE!");
  if (t <= 1)
    return [1317, 8, 29];
  if (t < 60)
    return [1317, t < 32 ? 9 : 10, 1 + (t - 2) % 30];
  const e = 10631 / 30, n = 8.01 / 60;
  let r = t + 466935;
  const s = Ce(r / 10631);
  r = r - 10631 * s;
  const i = Ce((r - n) / e);
  r = r - Ce(i * e + n);
  const o = Ce((r + 28.5001) / 29.5);
  return o === 13 ? [30 * s + i, 12, 30] : [30 * s + i, o, r - Ce(29.5001 * o - 29)];
}
function Sc(t, e = 0, n = !0) {
  const r = Ce(t);
  return e === zn ? km(r) : e === Mm ? Pm(r) : Tc(r, n);
}
const Xr = Math.floor, ci = 86400;
function ma(t, e) {
  let n = null;
  if (Array.isArray(t)) {
    const [r, s, i, o, a, l] = t;
    n = Date.UTC(r, s == null ? 0 : s - 1, i ?? 1, o || 0, a || 0, l || 0);
  } else if (t instanceof Date && (n = t * 1, !e || !e.ignoreTimezone)) {
    const r = /* @__PURE__ */ new Date();
    r.setUTCFullYear(
      t.getFullYear(),
      t.getMonth(),
      t.getDate()
    ), r.setUTCHours(
      t.getHours(),
      t.getMinutes(),
      t.getSeconds(),
      t.getMilliseconds()
    ), n = r * 1;
  }
  if (n != null && isFinite(n)) {
    const r = n / 864e5;
    return r - (r <= -25509 ? -25568 : -25569);
  }
  return null;
}
function Bm(t, e) {
  let n = t | 0;
  const r = ci * (t - n);
  let s = Xr(r);
  r - s > 0.9999 && (s += 1, s === ci && (s = 0, n += 1));
  const i = s < 0 ? ci + s : s, [o, a, l] = Sc(t, 0, e && e.leap1900), u = Xr(i / 60 / 60) % 60, c = Xr(i / 60) % 60, d = Xr(i) % 60;
  return [o, a, l, u, c, d];
}
const Hm = [
  // day-month-year
  "!d-m-y",
  "!d-m-Y",
  "!j-m-y",
  "!j-m-Y",
  "!d-n-y",
  "!d-n-Y",
  "!j-n-y",
  "!j-n-Y",
  // month-day-year
  "?m-d-y",
  "?m-d-Y",
  "?m-j-y",
  "?m-j-Y",
  "?n-d-y",
  "?n-d-Y",
  "?n-j-y",
  "?n-j-Y",
  // unab
  "d-M-y",
  "d-M-Y",
  "j-M-y",
  "j-M-Y",
  "M-d-y",
  "M-d-Y",
  "M-j-y",
  "M-j-Y",
  "d-F-y",
  "d-F-Y",
  "F-d-y",
  "F-d-Y",
  "F-j-y",
  "F-j-Y",
  "j-F-y",
  "j-F-Y",
  "y-F-d",
  "y-F-j",
  "y-M-d",
  "y-M-j",
  "Y-F-d",
  "Y-F-j",
  "Y-M-d",
  "Y-m-d",
  "Y-M-j",
  "Y-m-j",
  "Y-n-d",
  "Y-n-j",
  "j-F",
  // 2-April
  "j-M",
  // 2-Apr
  "d-F",
  // 02-April
  "d-M",
  // 02-Apr
  "n-d",
  // 4-02
  "n-j",
  // 4-2
  "n-Y",
  // 4-1908
  "m-d",
  // 04-02
  "m-j",
  // 04-2
  "m-Y",
  // 04-1908
  "M-Y",
  // Apr-1908
  "M-y",
  // Apr-08
  "F-y",
  // April-08
  "F-Y",
  // April-1908
  "Y-M",
  // 1908-Apr
  "Y-n",
  // 1908-4
  "Y-m",
  // 1908-04
  "Y-F",
  // 1908-April
  "Y-M"
  // 1908-Apr
], jm = { j: "d", d: "d", D: "ddd", l: "dddd", n: "m", m: "m", M: "mmm", F: "mmmm", y: "yy", Y: "yyyy" }, $m = { j: "dd", d: "dd", D: "ddd", l: "dddd", n: "mm", m: "mm", M: "mmm", F: "mmmm", y: "yy", Y: "yyyy" }, wc = {}, Oc = {};
function ve(t, e, n = 1) {
  if (t) {
    const r = t[0], s = t.slice(1);
    r === "!" ? ve(s, e, 4) : r === "?" ? ve(s, e, 2) : (e[r] = e[r] || {}, ve(s, e[r], n));
  } else
    e.$ = n;
}
function Rl(t, e) {
  ve(t, e), ve(t + " x", e), ve(t + " l", e), ve(t + " l x", e), ve("l " + t, e), ve("l " + t + " x", e), ve(t + " D", e), ve(t + " D x", e), ve("D " + t, e), ve("D " + t + " x", e);
}
Hm.forEach((t) => {
  t[0] !== "?" && Rl(t, wc), t[0] !== "!" && Rl(t, Oc);
});
const Wm = (/* @__PURE__ */ new Date()).getUTCFullYear(), bl = ".", Vm = ",", di = " ", Or = " ", Ar = " ", Cs = "'", Rs = "٬", Gm = {
  ".": [Vm, Or, Ar, Cs, Rs],
  ",": [bl, Or, Ar, Cs, Rs],
  "٫": [bl, Or, Ar, Cs, Rs]
}, hi = (t) => t && t.length === 1 && t >= "0" && t <= "9";
function _a(t, e = {}) {
  const n = ar(e.locale || "") || _n, r = n.decimal, s = [...Gm[r] || [Cs, Rs]];
  !s.includes(n.group) && n.group !== di && n.group !== r && s.push(n.group);
  let i = "", o = "", a = 1, l = "", u = !1, c = !1, d = !1, h = !1, f = !1, p = null, g = !1, _ = 0;
  const C = [di, Or, Ar, "+", "%", "(", "-"].concat(Pi);
  for (; C.includes(t[_]); ) {
    const R = t[_];
    if (R === "-") {
      if (u || c)
        return null;
      u = !0, a = -1;
    } else if (ki.test(R)) {
      if (f)
        return null;
      f = !0, p = R;
    } else if (R === "(") {
      if (c || u)
        return null;
      c = !0, a = -1;
    } else if (R === "%") {
      if (h)
        return null;
      h = !0;
    }
    _++;
  }
  let S = !1, T;
  if (t[_] === r || hi(t[_]))
    for (; _ < t.length; ) {
      const R = t[_];
      if (!T && s.includes(R))
        T = R;
      else if (!(T && T === R)) if (R === r) {
        if (S)
          break;
        i += ".", S = !0;
      } else if (hi(R))
        i += R;
      else
        break;
      _++;
    }
  if (t[_] === "e" || t[_] === "E") {
    o += t[_], _++, (t[_] === "+" || t[_] === "-") && (o += t[_], _++);
    const R = _;
    for (; hi(t[_]); )
      o += t[_], _++;
    if (R === _)
      return null;
  }
  const w = [di, Or, Ar, "%", "$", ")"].concat(Pi);
  for (; w.includes(t[_]); ) {
    const R = t[_];
    if (ki.test(R)) {
      if (f)
        return null;
      f = !0, p = R, g = !0;
    } else if (R === ")") {
      if (d || !c)
        return null;
      d = !0;
    } else if (R === "%") {
      if (h)
        return null;
      h = !0;
    }
    _++;
  }
  if (_ !== t.length)
    return null;
  let E = parseFloat(i + o);
  if (!isFinite(E))
    return null;
  if (o) {
    if (h || f)
      return null;
    l = "0.00E+00";
  } else if (h) {
    if (f)
      return null;
    l = i.includes(".") ? "0.00%" : "0%", E *= 0.01;
  } else if (f) {
    const R = i.includes(".") ? "#,##0.00" : "#,##0";
    g ? l = R + p : l = p + R;
  } else T && (l = i.includes(".") ? "#,##0.00" : "#,##0");
  const v = { v: E * a };
  return l && (v.z = l), v;
}
function Ym(t, e, n) {
  if (n < 1 || e < 1 || e > 12)
    return !1;
  if (e === 2) {
    const s = t % 4 === 0 && t % 100 !== 0 || t % 400 === 0 || t === 1900 ? 29 : 28;
    if (n > s)
      return !1;
  } else if ((e === 4 || e === 6 || e === 9 || e === 11) && n > 30 || (e === 1 || e === 3 || e === 5 || e === 7 || e === 8 || e === 10 || e === 12) && n > 31)
    return !1;
  return !0;
}
const Il = (t, e, n = !1) => {
  for (const r of e)
    if (t.startsWith(r[0])) {
      let s = r[0].length;
      return n && (r[2] === "D" || r[2] === "M") && t[s] === "." && s++, [t.slice(0, s), r];
    }
  return ["", null];
}, Ge = (t, e, n, r) => {
  const s = n.path || "", i = Object.keys(e);
  for (let o = 0; o < i.length; o++) {
    let a;
    const l = i[o];
    if (e[l]) {
      if (l === "$" || l === "€")
        t || (a = n);
      else if (l === "-") {
        const u = /^(\s*([./-]|,\s)\s*|\s+)/.exec(t);
        if (u) {
          const c = u[1] === "-" || u[1] === "/" || u[1] === "." ? u[1] : " ";
          if (!n.sep || n.sep === c) {
            const d = u[0].replace(/\s+/g, " ");
            a = Ge(t.slice(u[0].length), e[l], { ...n, sep: c, path: s + d }, r);
          }
        }
      } else if (l === " ") {
        const u = /^[,.]?\s+/.exec(t);
        if (u) {
          const c = u[0].replace(/\s+/g, " ");
          a = Ge(t.slice(u[0].length), e[l], { ...n, path: s + c }, r);
        }
      } else if (l === "j" || l === "d") {
        const u = /^(0?[1-9]|1\d|2\d|3[01])\b/.exec(t);
        u && (a = Ge(t.slice(u[0].length), e[l], { ...n, day: u[0], path: s + l }, r));
      } else if (l === "n" || l === "m") {
        const u = /^(0?[1-9]|1[012])\b/.exec(t);
        u && (a = Ge(t.slice(u[0].length), e[l], { ...n, month: +u[0], _mon: u[0], path: s + l }, r));
      } else if (l === "F" || l === "M") {
        const [u, c] = Il(t, r.mon, r.mp);
        c && c[2] === l && (a = Ge(
          t.slice(u.length),
          e[l],
          { ...n, month: c[1], _mon: u, path: s + l },
          r
        ));
      } else if (l === "l" || l === "D") {
        const [u, c] = Il(t, r.day, r.dp);
        c && c[2] === l && (a = Ge(t.slice(u.length), e[l], { ...n, path: s + l }, r));
      } else if (l === "y") {
        const u = /^\d\d\b/.exec(t);
        if (u) {
          const c = +u[0] >= 30 ? +u[0] + 1900 : +u[0] + 2e3;
          a = Ge(t.slice(u[0].length), e[l], { ...n, year: c, path: s + l }, r);
        }
      } else if (l === "Y") {
        const u = /^\d\d\d\d\b/.exec(t);
        u && (a = Ge(t.slice(u[0].length), e[l], { ...n, year: +u[0], path: s + l }, r));
      } else if (l === "x") {
        const u = Ys(t, { locale: r.locale });
        u && (a = Ge("", e[l], { ...n, time: u.v, tf: u.z, path: s + l }, r));
      } else
        throw new Error(`Unknown date token "${l}"`);
      if (a && Ym(n.year || 1916, n.month || 1, n.day ? +n.day : 1))
        return a;
    }
  }
}, Ac = (t) => t.replace(/\s+/g, " ").trim().replace(/’/, "'").replace(/\.$/, "").toLowerCase(), Qr = (t, e) => {
  const n = t.map((r, s) => [Ac(r), s + 1, e]);
  return n.sort((r, s) => s[0].length - r[0].length), n;
};
function ya(t, e = {}) {
  const n = ar(e.locale || "") || _n, r = {
    mon: Qr(n.mmmm, "F").concat(Qr(n.mmm, "M")),
    mp: n.mmm[0].at(-1) === ".",
    day: Qr(n.dddd, "l").concat(Qr(n.ddd, "D")),
    dp: n.ddd[0].at(-1) === ".",
    locale: e.locale
  }, s = Ge(
    Ac(t),
    n.preferMDY ? Oc : wc,
    { path: "" },
    r
  );
  if (s) {
    if (s.sep === "." && s.path.length === 3)
      return null;
    const i = +(s.year ?? Wm);
    s.day || (s.day = 1);
    let o = -1 / 0;
    if (i < 1900)
      return null;
    i <= 1900 && s.month <= 2 ? o = 25568 : i < 1e4 && (o = 25569);
    const a = Date.UTC(i, s.month - 1, s.day) / 864e5 + o + (s.time || 0);
    if (a >= 0 && a <= 2958465) {
      const l = (
        // either has a leading zero
        s._mon[0] === "0" || s.day[0] === "0" || // both are 2-digits long
        s._mon.length === 2 && s.day.length === 2
      ), u = s.path.replace(/[jdlDnmMFyYx]/g, (c) => c === "x" ? s.tf || "" : (l ? $m[c] : jm[c]) || c);
      return { v: a, z: u };
    }
  }
  return null;
}
const fi = (t) => t.replace(/\s+/g, "").trim().replace(/\./g, "").toLowerCase();
function Ys(t, e = {}) {
  const n = ar(e.locale || "") || _n, r = /^\s*([10]?\d|2[0-4])(?::([0-5]\d|\d))?(?::([0-5]\d|\d))?(\.\d{1,10})?(?=\s*[^\s\d]|$)/.exec(t);
  let s = "";
  if (r) {
    const i = fi(t.slice(r[0].length));
    if (i === fi(n.ampm[0]) || i === "a" || i === "am")
      s = "a";
    else if (i === fi(n.ampm[1]) || i === "p" || i === "pm")
      s = "p";
    else if (i)
      return null;
  }
  if (r) {
    const [, i, o, a, l] = r;
    if (l && !a || !s && !o && !a)
      return null;
    let u = +(i || 0) * 1;
    if (s) {
      if (u >= 13)
        return null;
      s === "p" && (u += 12);
    }
    const c = +(o || 0) * 1, d = +(a || 0) * 1, h = +(l || 0) * 1;
    return {
      v: (u * 60 * 60 + c * 60 + d + h) / (60 * 60 * 24),
      z: (i.length === 2 ? "hh" : "h") + ":mm" + (a ? ":ss" : "") + (s ? " AM/PM" : "")
    };
  }
  return null;
}
function Nc(t, e = {}) {
  const n = ar(e.locale || "") || _n, r = t.trim().toLowerCase(), s = n.bool[0].toLowerCase();
  if (r === "true" || r === s)
    return { v: !0 };
  const i = n.bool[1].toLowerCase();
  return r === "false" || r === i ? { v: !1 } : null;
}
function zm(t, e) {
  return _a(t, e) ?? ya(t, e) ?? Ys(t, e) ?? Nc(t, e);
}
function In(t, e, n) {
  return e[n + "_max"] = t.length, e[n + "_min"] = t.replace(/#/g, "").length, e;
}
function $t(t, e) {
  typeof t == "string" ? e.push({ type: "string", value: t }) : e.push(t);
}
function Tl(t, e) {
  const n = t && t.type;
  return n === jo || n === Kn || n === $o || n === Vs && e === "den";
}
function br(t) {
  var T, w, E;
  const e = [], n = {
    scale: 1,
    percent: !1,
    text: !1,
    date: 0,
    date_eval: !1,
    date_system: Cl,
    sec_decimals: 0,
    general: !1,
    clock: 24,
    int_pattern: [],
    frac_pattern: [],
    man_pattern: [],
    den_pattern: [],
    num_pattern: [],
    tokens: e
  };
  let r = "int", s = null;
  const i = [];
  let o, a = !1, l = -1, u = !1, c = "", d = !1;
  for (; ++l < t.length && !u; ) {
    const v = t[l], R = v.type || Pr;
    if (c += v.raw, R === Ho)
      n.general = !0, $t(v, e);
    else if (Tl(v, r)) {
      const I = n[r + "_pattern"];
      Tl(o, r) || (o == null ? void 0 : o.type) === Ur ? (I.push((I.pop() || "") + v.value), s.num += v.value) : (I.push(v.value), s = { type: r, num: v.value }, $t(s, e));
    } else if (R === ca)
      v.value === "(" && (n.parens = !0), $t(v.value, e);
    else if (R === Vs)
      $t(v.value, e);
    else if (R === Wo)
      if (d = !0, n[r + "_pattern"].length) {
        if (!s)
          throw new SyntaxError("Format pattern is missing a numerator");
        n.fractions = !0, n.num_pattern.push(n[r + "_pattern"].pop()), s.type = "num", r = "den", $t({ type: "div" }, e);
      } else
        $t(v.value, e);
    else if (R === Vo)
      $t(",", e);
    else if (R === Ns)
      n.scale = 1e-3 ** v.raw.length;
    else if (R === Ur) {
      if (r === "int" && (n.grouping = !0), r === "den")
        throw new SyntaxError("Cannot group denominator digits");
    } else if (R === Ko)
      $t(v, e);
    else if (R === Go) {
      u = !0;
      break;
    } else if (R === Ws)
      n.text = !0, $t(v, e);
    else if (R === Yo || R === zo)
      $t(v, e);
    else if (R === Zo) {
      const I = v.value.toLowerCase(), A = I[0], L = { type: "", size: 0, date: 1, pad: I.length };
      A === "h" ? (L.size = vr, L.type = "hour-elap") : A === "m" ? (L.size = Cr, L.type = "min-elap") : (L.size = Rr, L.type = "sec-elap"), n.date = n.date | L.size, i.push(L), $t(L, e);
    } else if (n.date && R === Ds && ((T = t[l + 1]) == null ? void 0 : T.type) === Kn) {
      let I = 1;
      l++;
      let A = "0";
      ((w = t[l + 1]) == null ? void 0 : w.type) === Kn && (A += "0", I = 2, l++), ((E = t[l + 1]) == null ? void 0 : E.type) === Kn && (A += "0", I = 3, l++), c += A;
      const L = [Rr, xi, Fi, Ui][I];
      n.date = n.date | L, n.date_eval = !0, n.sec_decimals = Math.max(n.sec_decimals, I), $t({
        type: "subsec",
        size: L,
        decimals: I,
        date: 1
      }, e);
    } else if (R === Qo)
      a || (v.value === "B2" || v.value === "b2" ? n.date_system = zn : n.date_system = Cl);
    else if (R === Jo) {
      const I = { type: "", size: 0, date: 1 }, A = v.value.toLowerCase(), L = A[0];
      if (A === "y" || A === "yy")
        I.size = yr, I.type = "year-short";
      else if (L === "y" || L === "e")
        I.size = yr, I.type = "year";
      else if (A === "b" || A === "bb")
        I.size = yr, I.type = "b-year-short";
      else if (L === "b")
        I.size = yr, I.type = "b-year";
      else if (A === "d" || A === "dd")
        I.size = vs, I.type = "day", I.pad = /dd/.test(A);
      else if (A === "ddd" || A === "aaa")
        I.size = vs, I.type = "weekday-short";
      else if (L === "d" || L === "a")
        I.size = vs, I.type = "weekday";
      else if (L === "h")
        I.size = vr, I.type = "hour", I.pad = /hh/i.test(A);
      else if (L === "m") {
        A.length === 3 ? (I.size = Er, I.type = "monthname-short") : A.length === 5 ? (I.size = Er, I.type = "monthname-single") : A.length >= 4 && (I.size = Er, I.type = "monthname");
        const N = i[i.length - 1];
        !I.type && N && !N.used && N.size & (vr | Rr) && (N.used = !0, I.size = Cr, I.type = "min", I.pad = /mm/.test(A)), I.type || (I.size = Er, I.type = "month", I.pad = /mm/.test(A), I.indeterminate = !0);
      } else if (L === "s") {
        I.size = Rr, I.type = "sec", I.pad = /ss/.test(A);
        const N = i[i.length - 1];
        N && N.size & Cr ? I.used = !0 : N && N.indeterminate && (delete N.indeterminate, N.size = Cr, N.type = "min", I.used = !0);
      }
      n.date = n.date | I.size, n.date_eval = !0, i.push(I), $t(I, e);
    } else if (R === sa)
      n.clock = 12, n.date = n.date | vr, n.date_eval = !0, v.short = v.value === "A/P", $t(v, e);
    else if (R === oa || R === ia || R === Gs)
      $t(v.value, e);
    else if (R === qo)
      n.condition = [
        v.value[0],
        // operator
        parseFloat(v.value[1])
        // operand
      ];
    else if (R === na) {
      const I = v.value.split("-"), A = I.length < 2 ? "" : I.slice(1).join("-"), L = I[0];
      L && $t(L, e);
      const N = ha(A);
      N && (n.locale = N);
      const ut = parseInt(A, 16);
      isFinite(ut) && ut & 16711680 && (ut >> 16 & 255) === 6 && (n.date_system = zn), a = !0;
    } else if (R === ra) {
      let I, A = v.value.toLowerCase();
      (I = /^color\s*(\d+)$/i.exec(A)) && (A = parseInt(I[1], 10)), n.color = A;
    } else if (R === Xo)
      n.scale = 100, n.percent = !0, $t("%", e);
    else if (R === Ds)
      $t(v, e), n.date || (n.dec_fractions = !0, r = "frac");
    else if (R === la)
      n.exponential = !0, n.exp_plus = v.value.includes("+"), r = "man", $t({ type: "exp", plus: n.exp_plus }, e);
    else if (R === aa)
      $t(v, e);
    else if (R === ua)
      $t(v, e);
    else if (!(R === ta || R === ea)) throw R === Pr ? new SyntaxError(`Illegal character: ${c}`) : new SyntaxError(`Unknown token ${R} in ${c}`);
    o = v;
  }
  if (n.tokensUsed = l, n.pattern = c, /^((?:\[[^\]]+\])+)(;|$)/.test(n.pattern) && !/^\[(?:h+|m+|s+)\]/.test(n.pattern) && $t({ type: "text" }, e), n.fractions && n.dec_fractions || n.grouping && !n.int_pattern.length || n.fractions && n.exponential || n.fractions && n.den_pattern.length * n.num_pattern.length === 0 || d && !n.fractions && !n.date || n.exponential && (n.int_pattern.length || n.frac_pattern.length) * n.man_pattern.length === 0)
    throw new SyntaxError(`Invalid pattern: ${c}`);
  const h = n.int_pattern.join(""), f = n.man_pattern.join(""), p = n.frac_pattern.join("");
  In(h, n, "int");
  let g = 0;
  for (let v = 0; v < h.length; v++) {
    const R = h[h.length - 1 - v];
    /^[0-9?]/.test(R) && (g = v + 1);
  }
  n.int_min = g, In(p, n, "frac"), In(f, n, "man");
  let _ = n.num_pattern.join(""), C = n.den_pattern[0] || "";
  if (C.includes("?") || _.includes("?") ? (C = C.replace(/\d/g, "?"), C = C.replace(/#$/g, "?"), In(_, n, "num"), In(C, n, "den"), _ = _.replace(/#$/g, "?")) : (In(_, n, "num"), In(C, n, "den")), n.int_p = h, n.man_p = f, n.num_p = _, n.den_p = C, n.den_pattern.length && (n.denominator = parseInt(n.den_pattern.join("").replace(/\D/g, ""), 10)), n.integer = !!h.length, !n.integer && !n.exponential && p.length) {
    const v = n.tokens.findIndex((R) => R.type === "point");
    n.tokens.splice(v, 0, { type: "int", value: "#" }), n.integer = !0, n.int_pattern = ["#"], n.int_p = "#";
  }
  if (n.fractions)
    for (let v = 0; v < e.length - 1; v++) {
      const R = e[v];
      if (R.type !== "string" && R.type !== "space")
        continue;
      const I = e[v + 1].type;
      I === "num" ? R.rule = "num+int" : I === "div" ? R.rule = "num" : I === "den" && (R.rule = "den");
    }
  return n.grouping && n.int_pattern.length > 1 && (n.grouping = !1), n;
}
function Km(t) {
  if (t === 0)
    return t;
  const e = Math.ceil(Math.log10(t < 0 ? -t : t)), n = 10 ** (16 - Math.floor(e));
  return isFinite(n) ? Math.round(t * n) / n : 0;
}
function Dc(t, e = 0) {
  const n = Math.floor(Math.log10(t));
  return e > 1 ? Math.floor(n / e) * e : n;
}
function Mc(t, e = 1) {
  return e < -300 ? parseFloat(t.toExponential().split("e")[0]) : t * 10 ** -e;
}
const Xm = {
  total: 1,
  sign: 0,
  period: 0,
  int: 1,
  frac: 0
};
function Qm(t, e = !0) {
  const n = Math.abs(t);
  if (!n)
    return Xm;
  const r = e && t < 0 ? 1 : 0, s = Math.floor(n), i = Math.floor(Math.log10(n) + 1);
  let o = 0, a = 0;
  if (s !== n) {
    o = 1;
    const l = String(
      Ne(n * 10 ** -i, 15)
    );
    let u = l.length, c = !0, d = 0;
    for (; d <= l.length; ) {
      if (l[d] === ".") {
        u--;
        break;
      } else l[d] === "0" && c ? u-- : c = !1;
      d++;
    }
    a = u - i, a < 0 && (a = 0, o = 0);
  }
  return {
    total: r + Math.max(i, 1) + o + a,
    digits: Math.max(i, 0) + a,
    sign: r,
    period: o,
    int: Math.max(i, 1),
    frac: a
  };
}
const Hn = (t, e) => t.replace(/\./, e.decimal), Sl = (t, e, n) => {
  const r = Math.abs(e);
  let s;
  return t === 1 ? s = t : s = Ne(t, 5), [
    Hn(s + "", n),
    n.exponent,
    e < 0 ? n.negative : n.positive,
    r < 10 ? "0" : "",
    r
  ];
};
function wl(t, e, n, r) {
  const s = n | 0;
  if (typeof n == "string")
    t.push(n);
  else if (n === s)
    t.push(Math.abs(s));
  else {
    const i = Math.abs(n);
    let o = Dc(i), a = Mc(i, o);
    a === 10 && (a = 1, o++);
    const l = Qm(i);
    if (o >= -4 && o <= -1) {
      const u = i.toPrecision(10 + o).replace(/\.?0+$/, "");
      t.push(Hn(u, r));
    } else if (o === 10) {
      const u = i.toFixed(10).slice(0, 12).replace(/\.$/, "");
      t.push(Hn(u, r));
    } else if (Math.abs(o) <= 9)
      if (l.total <= 11) {
        const u = Ne(i, 9).toFixed(l.frac);
        t.push(Hn(u, r));
      } else o === 9 ? t.push(Math.floor(i)) : o >= 0 && o < 9 ? t.push(Hn(String(Ne(i, 9 - o)), r)) : t.push(...Sl(a, o, r));
    else l.total >= 12 ? t.push(...Sl(a, o, r)) : t.push(Hn(Ne(i, 9).toFixed(l.frac), r));
  }
  return t;
}
function Tn(t, e = !1) {
  return t === "0" ? "0" : t === "?" ? e ? " " : " " : "";
}
const hr = 86400, Jm = (t, e, n) => n ? t < Nm || e >= Dm : t < Om || e >= Am;
function Ol(t, e, n, r) {
  let s = "", i = "", o = "", a = "", l = "", u = "", c = 0, d = 0;
  if (typeof t == "bigint") {
    if (t <= Number.MAX_SAFE_INTEGER && t >= Number.MIN_SAFE_INTEGER)
      t = Number(t);
    else
      return n.bigintErrorNumber ? String(t) : n.overflow;
    d = t;
  } else
    d = Math.trunc(t);
  let h = 0, f = 0, p = 1, g = 0, _ = 0, C = 0, S = 0, T = 0, w = 0;
  const E = r || _n;
  if (!e.text && isFinite(e.scale) && e.scale !== 1 && (t = Km(t * e.scale)), e.exponential) {
    let K = Math.abs(t);
    K && (c = Dc(K, e.int_max)), t && !e.integer && c++, K = Mc(K, c), e.int_max === 1 && Ne(K, e.frac_max) === 10 && (K = 1, c++), t = t < 0 ? -K : K, s += Math.abs(c);
  }
  if (e.integer) {
    const K = Math.abs(Ne(t, e.fractions ? 1 : e.frac_max));
    u += K < 1 ? "" : Math.floor(K);
  }
  const v = n.grouping[0] ?? 3, R = n.grouping[1] ?? v;
  e.dec_fractions && (l = String(Ne(t, e.frac_max)).split(".")[1] || "");
  const I = !e.error && (e.num_p.includes("0") || e.den_p.includes("0"));
  let A = I;
  if (e.fractions) {
    A = I || !!(t % 1);
    const K = Math.abs(e.integer ? t % 1 : t);
    if (K)
      if (A = !0, e.denominator && isFinite(e.denominator))
        a += e.denominator, o += Ne(K * e.denominator), o === "0" && (o = "", a = "", A = I);
      else {
        const dt = Ic(K, 1 / 0, e.den_max);
        o += dt[0], a += dt[1], e.integer && o === "0" && (o = "", a = "", A = I);
      }
    else !t && !e.integer && (A = !0, o = "0", a = "1");
    e.integer && !A && !Math.trunc(t) && (u = "0");
  }
  if (e.date) {
    d = Math.trunc(t);
    const K = hr * (t - d);
    if (h = Math.floor(K), w = K - h, Math.abs(w) < 1e-6 ? w = 0 : w > 0.9999 && (w = 0, h += 1, h === hr && (h = 0, d += 1)), w) {
      const dt = e.date & Ui || e.date & Fi || e.date & xi;
      (dt === Ui && w > 0.9995 || dt === Fi && w > 0.995 || dt === xi && w > 0.95 || !dt && w >= 0.5) && (h++, w = 0);
    }
    if (d || e.date_system) {
      const dt = Sc(t, e.date_system, n.leap1900);
      f = dt[0], p = dt[1], g = dt[2];
    }
    if (h) {
      const dt = h < 0 ? hr + h : h;
      T = Math.floor(dt) % 60, S = Math.floor(dt / 60) % 60, C = Math.floor(dt / 60 / 60) % 60;
    }
    if (_ = (6 + d) % 7, e.date_eval && Jm(t, d + h / hr, n.dateSpanLarge)) {
      if (n.dateErrorThrows)
        throw new Error("Date out of bounds");
      if (n.dateErrorNumber) {
        const dt = t < 0 ? [E.negative] : [];
        return wl(dt, {}, t, E).join("");
      }
      return n.overflow;
    }
  }
  const L = Tn("?", n.nbsp);
  c < 0 ? i = "-" : e.exp_plus && (i = "+");
  const N = [], ut = (K, dt, lt, rt) => {
    const Xt = !rt && K.length > dt.length ? lt.length + K.length - dt.length : lt.length;
    K.length < dt.length && (rt += K.length - dt.length);
    for (let _t = 0; _t < Xt; _t++)
      N.push(K[_t + rt] || Tn(lt[_t], n.nbsp));
    return Xt;
  };
  let ct = !1;
  const st = { int: 0, frac: 0, man: 0, num: 0, den: 0 };
  for (let K = 0, dt = e.tokens.length; K < dt; K++) {
    const lt = e.tokens[K], rt = lt.type, Xt = lt.num ? lt.num.length : 0;
    if (rt === "string")
      lt.rule ? lt.rule === "num" ? A ? N.push(lt.value.replace(/ /g, L)) : (e.num_min > 0 || e.den_min > 0) && N.push(lt.value.replace(/./g, L)) : lt.rule === "num+int" ? A && u ? N.push(lt.value.replace(/ /g, L)) : e.den_min > 0 && (u || e.num_min) && N.push(lt.value.replace(/./g, L)) : lt.rule === "den" && (A ? N.push(lt.value.replace(/ /g, L)) : (e.den_min > 0 || e.den_min > 0) && N.push(lt.value.replace(/./g, L))) : N.push(lt.value.replace(/ /g, L));
    else if (rt === "space")
      lt.rule === "num+int" ? (A || e.num_min || e.den_min) && (u || e.num_min) && N.push(L) : N.push(L);
    else if (rt === "error")
      N.push(n.invalid);
    else if (rt === "point")
      N.push(e.date ? lt.value : E.decimal);
    else if (rt === "general")
      wl(N, e, t, E);
    else if (rt === "exp")
      N.push(E.exponent);
    else if (rt === "minus")
      lt.volatile && e.date || lt.volatile && (t >= 0 || typeof t != "number") || (lt.volatile && !e.fractions && (e.integer || e.dec_fractions) ? (t < 0 && u && u !== "0" || l) && N.push(E.negative) : N.push(E.negative));
    else if (rt === "plus")
      N.push(E.positive);
    else if (rt === "text")
      N.push(t);
    else if (rt === "fill")
      n.fillChar && N.push(n.fillChar, lt.value);
    else if (rt === "skip")
      n.skipChar ? N.push(n.skipChar, lt.value) : N.push(n.nbsp ? " " : " ");
    else if (rt === "div")
      A ? N.push("/") : e.num_min > 0 || e.den_min > 0 ? N.push(L) : N.push(Tn("#", n.nbsp));
    else if (rt === "int")
      if (e.int_pattern.length === 1) {
        const _t = e.int_p, At = Math.max(e.int_min, u.length);
        let Jt = "";
        for (let le = At; le > 0; le--) {
          const un = u.charAt(u.length - le), b = un ? "" : _t.charAt(_t.length - le) || _t[0];
          let O = "";
          if (e.grouping) {
            const U = le - 1 - v;
            U >= 0 && !(U % R) && (O = un || b === "0" ? E.group : Tn("?", n.nbsp));
          }
          Jt += (un || Tn(b, n.nbsp)) + O;
        }
        N.push(Jt);
      } else
        st.int += ut(u, e.int_p, lt.num, st.int);
    else if (rt === "frac") {
      const _t = st.frac;
      for (let At = 0; At < Xt; At++)
        N.push(l[At + _t] || Tn(lt.num[At], n.nbsp));
      st.frac += Xt;
    } else if (rt === "man")
      !st[rt] && !st.man && N.push(i), st.man += ut(s, e.man_p, lt.num, st.man);
    else if (rt === "num")
      st.num += ut(o, e.num_p, lt.num, st.num);
    else if (rt === "den") {
      const _t = st.den;
      for (let At = 0; At < Xt; At++) {
        let Jt = a[At + _t];
        if (!Jt) {
          const le = lt.num[At];
          "123456789".includes(le) || ct && le === "0" ? (ct = !0, Jt = n.nbsp ? " " : " ") : !ct && At === Xt - 1 && le === "0" && !a ? Jt = "1" : Jt = Tn(le, n.nbsp);
        }
        N.push(Jt);
      }
      st.den += Xt;
    } else if (rt === "year")
      f < 0 && N.push(E.negative), N.push(String(Math.abs(f)).padStart(4, "0"));
    else if (rt === "year-short") {
      const _t = f % 100;
      N.push(_t < 10 ? "0" : "", _t);
    } else if (rt === "month")
      N.push(lt.pad && p < 10 ? "0" : "", p);
    else if (rt === "monthname-single")
      e.date_system === zn ? N.push(E.mmmm6[p - 1].charAt(0)) : N.push(E.mmmm[p - 1].charAt(0));
    else if (rt === "monthname-short")
      e.date_system === zn ? N.push(E.mmm6[p - 1]) : N.push(E.mmm[p - 1]);
    else if (rt === "monthname")
      e.date_system === zn ? N.push(E.mmmm6[p - 1]) : N.push(E.mmmm[p - 1]);
    else if (lt.type === "weekday-short")
      N.push(E.ddd[_]);
    else if (rt === "weekday")
      N.push(E.dddd[_]);
    else if (rt === "day")
      N.push(lt.pad && g < 10 ? "0" : "", g);
    else if (rt === "hour") {
      const _t = C % e.clock || (e.clock < 24 ? e.clock : 0);
      N.push(lt.pad && _t < 10 ? "0" : "", _t);
    } else if (rt === "min")
      N.push(lt.pad && S < 10 ? "0" : "", S);
    else if (rt === "sec")
      N.push(lt.pad && T < 10 ? "0" : "", T);
    else if (rt === "subsec") {
      N.push(E.decimal);
      const _t = w.toFixed(e.sec_decimals);
      N.push(_t.slice(2, 2 + lt.decimals));
    } else if (rt === "ampm") {
      const _t = C < 12 ? 0 : 1;
      lt.short && !r ? N.push("AP"[_t]) : N.push(E.ampm[_t]);
    } else if (rt === "hour-elap") {
      t < 0 && N.push(E.negative);
      const _t = d * 24 + Math.floor(Math.abs(h) / (60 * 60));
      N.push(String(Math.abs(_t)).padStart(lt.pad, "0"));
    } else if (rt === "min-elap") {
      t < 0 && N.push(E.negative);
      const _t = d * 1440 + Math.floor(Math.abs(h) / 60);
      N.push(String(Math.abs(_t)).padStart(lt.pad, "0"));
    } else if (rt === "sec-elap") {
      t < 0 && N.push(E.negative);
      const _t = d * hr + Math.abs(h);
      N.push(String(Math.abs(_t)).padStart(lt.pad, "0"));
    } else if (rt === "b-year")
      N.push(f + 543);
    else if (rt === "b-year-short") {
      const _t = (f + 543) % 100;
      N.push(_t < 10 ? "0" : "", _t);
    }
  }
  return N.join("");
}
const Zm = br([
  { type: Ws, value: "@", raw: "@" }
]);
function Lc(t, e) {
  for (let n = 0; n < 3; n++) {
    const r = e[n];
    if (r) {
      let s;
      if (r.condition) {
        const i = r.condition[0], o = r.condition[1];
        i === "=" ? s = t === o : i === ">" ? s = t > o : i === "<" ? s = t < o : i === ">=" ? s = t >= o : i === "<=" ? s = t <= o : i === "<>" && (s = t !== o);
      } else
        s = !0;
      if (s)
        return r;
    }
  }
}
function qm(t, e, n) {
  const r = e.partitions;
  let s = r[3], i = null;
  return (typeof t == "number" || typeof t == "bigint") && isFinite(t) && (s = Lc(t, r)), s && s.color && (i = s.color), i && typeof i == "number" && n.indexColors && (i = Lm[i - 1] || "#000"), i;
}
function t0(t, e, n) {
  const r = e.partitions, s = ar(e.locale || n.locale), i = r[3] ? r[3] : Zm;
  if (typeof t == "boolean" && (t = (s || _n).bool[t ? 0 : 1]), t == null)
    return "";
  const o = typeof t == "bigint";
  if (typeof t != "number" && !o)
    return Ol(t, i, n, s);
  if (!o && !isFinite(t)) {
    const l = s || _n;
    return isNaN(t) ? l.nan : (t < 0 ? l.negative : "") + l.infinity;
  }
  const a = Lc(t, r);
  return a ? Ol(t, a, n, s) : n.overflow;
}
function xc(t) {
  return !!(t[0] && t[0].percent || t[1] && t[1].percent || t[2] && t[2].percent || t[3] && t[3].percent);
}
function Fc(t) {
  return !!(t[0] && t[0].date || t[1] && t[1].date || t[2] && t[2].date || t[3] && t[3].date);
}
function Uc(t) {
  const [e, n, r, s] = t;
  return !!((!e || e.generated) && (!n || n.generated) && (!r || r.generated) && s && s.text && !s.generated);
}
const e0 = {
  text: 15,
  datetime: 10.8,
  date: 10.8,
  time: 10.8,
  percent: 10.6,
  currency: 10.4,
  grouped: 10.2,
  scientific: 6,
  number: 4,
  fraction: 2,
  general: 0,
  error: 0
}, n0 = [
  ["DMY", 1],
  ["DM", 2],
  ["MY", 3],
  ["MDY", 4],
  ["MD", 5],
  ["hmsa", 6],
  ["hma", 7],
  ["hms", 8],
  ["hm", 9]
];
function r0(t, e = null) {
  const [n, r] = t, s = n.frac_max, i = {
    type: "general",
    isDate: Fc(t),
    isText: Uc(t),
    isPercent: xc(t),
    maxDecimals: n.general ? 9 : s,
    scale: n.scale ?? 1,
    color: 0,
    parentheses: 0,
    grouped: n.grouping ? 1 : 0
  }, o = !i.isDate && !i.isText && !n.error && n.tokens.some((d) => d.type === "string" && (e ? d.value === e : ki.test(d.value)));
  let a = "G", l = s >= 0 ? Math.min(15, s) : "", u = "", c = "";
  if (r && r.color && (c = "-", i.color = 1), n.parens && (u = "()", i.parentheses = 1), o)
    a = "C", i.type = "currency";
  else if (n.error)
    i.type = "error", i.maxDecimals = 0;
  else if (i.isDate) {
    let d = 0, h = 0, f = "";
    n.tokens.forEach((g) => {
      const _ = g.type;
      /^(b-)?year/.test(_) ? (f += "Y", h++) : _.startsWith("month") ? (f += "M", h++) : /^(week)?day/.test(_) ? (f += "D", h++) : (_ === "hour" || _ === "min" || _ === "sec" || _ === "ampm") && (f += _[0], d++);
    }), i.type = "date", h && d ? i.type = "datetime" : !h && d && (i.type = "time");
    const p = n0.find((g) => f.startsWith(g[0]));
    a = p ? "D" : "G", l = p ? p[1] : "";
  } else i.isText ? (a = "G", i.type = "text", l = "", i.maxDecimals = 0) : n.general ? (a = "G", i.type = "general", l = "") : n.fractions ? (a = "G", i.type = "fraction", l = "") : n.exponential ? (a = "S", i.type = "scientific") : i.isPercent ? (a = "P", i.type = "percent") : n.grouping ? (a = ",", i.type = "grouped") : (n.int_max || s) && (a = "F", i.type = "number");
  return i.code = a + l + c + u, i.level = e0[i.type], Object.freeze(i);
}
function s0(t) {
  const [e] = t;
  return {
    year: !!(e.date & yr),
    month: !!(e.date & Er),
    day: !!(e.date & vs),
    hours: !!(e.date & vr),
    minutes: !!(e.date & Cr),
    seconds: !!(e.date & Rr),
    clockType: e.clock === 12 ? 12 : 24
  };
}
const i0 = [
  [Ho, /^General/i, 0],
  [jo, /^#/, 0],
  [Kn, /^0/, 0],
  [$o, /^\?/, 0],
  [Wo, /^\//, 0],
  // Commas are dealt with as a special case in the tokenizer but will end up
  // as one of these:
  // [ TOKEN_GROUP, /^(,),*/, 1 ],
  // [ TOKEN_SCALE, /^(,),*/, 1 ],
  // [ TOKEN_COMMA, /^(,),*/, 1 ],
  [Go, /^;/, 0],
  [Ws, /^@/, 0],
  [Yo, /^\+/, 0],
  [zo, /^-/, 0],
  [Ds, /^\./, 0],
  [Ko, /^ /, 0],
  [Xo, /^%/, 0],
  [Vs, /^[1-9]/, 0],
  [Qo, /^(?:B[12])/i, 0],
  [Pr, /^B$/, 0],
  // pattern must not end in a "B"
  [Jo, /^(?:[hH]+|[mM]+|[sS]+|[yY]+|[bB]+|[dD]+|[gG]+|[aA]{3,}|e+)/, 0],
  [Zo, /^(?:\[(h+|m+|s+)\])/i, 1],
  [qo, /^\[(<[=>]?|>=?|=)\s*(-?[.\d]+)\]/, [1, 2]],
  [ta, /^\[(DBNum[0-4]?\d)\]/i, 1],
  [ea, /^\[(NatNum[0-4]?\d)\]/i, 1],
  [na, /^\[\$([^\]]+)\]/, 1],
  [ra, /^\[(black|blue|cyan|green|magenta|red|white|yellow|color\s*\d+)\]/i, 1],
  // conditionally allow these open ended directions?
  [_c, /^\[([^\]]+)\]/, 1],
  [sa, /^(?:AM\/PM|am\/pm|A\/P)/, 0],
  [ia, /^\\(.)/, 1],
  [oa, /^"([^"]*?)"/, 1],
  [aa, /^_(\\.|.)/, 1],
  // Google Sheets and Excel diverge on "e": Excel only accepts E.
  [la, /^[Ee]([+-])/, 1],
  [ua, /^\*(\\.|.)/, 1],
  [ca, /^[()]/, 0],
  [Pr, /^[EÈÉÊËèéêëĒēĔĕĖėĘęĚěȄȅȆȇȨȩNnÑñŃńŅņŇňǸǹ["*/\\_]/, 0],
  [Gs, /^./, 0]
], o0 = 63, a0 = 35, l0 = 48, u0 = 57, pi = (t) => {
  const e = (t || "\0").charCodeAt(0);
  return e === o0 || e === a0 || e >= l0 && e <= u0;
};
function Gn(t) {
  let e = 0;
  const n = [], r = [];
  for (; e < t.length; ) {
    const s = t.slice(e);
    let i = 0;
    const o = /^(,+)(.)?/.exec(s);
    if (o) {
      const a = o[1];
      i = a.length;
      const l = t[e - 1] || "";
      let u = !1, c = !1;
      pi(l) ? (u = !0, c = !0) : l === "." && (c = !0);
      const d = o[2] || "";
      if (u && (!d || d === ";") && (u = !1), c && pi(d) && (c = !1), u && !c)
        n.push({ type: Ur, value: ",", raw: a });
      else if (!u && c)
        n.push({ type: Ns, value: ",", raw: a });
      else if (u && c) {
        const h = { type: Ns, value: ",", raw: a };
        n.push(h), r.push(h);
      } else
        n.push({ type: Vo, value: ",", raw: a });
    } else {
      let a;
      for (const [l, u, c] of i0) {
        const d = u.exec(s);
        if (d) {
          const h = Array.isArray(c) ? c.map((f) => d[f]) : d[c || 0];
          a = { type: l, value: h, raw: d[0] }, n.push(a), i = d[0].length;
          break;
        }
      }
      r.length && a.raw === ";" && (r.length = 0), r.length && pi(a.raw) && (r.forEach((l) => l.type = Ur), r.length = 0);
    }
    if (!i) {
      const a = s[0];
      i = 1, n.push({ type: Gs, value: a, raw: a });
    }
    e += i;
  }
  return n;
}
const gi = (t) => {
  const e = t.condition;
  e && e[1] < 0 && (e[0] === "<" || e[0] === "<=" || e[0] === "=") || t.tokens.unshift({
    type: "minus",
    volatile: !0
  });
}, Al = (t, e = null) => {
  const n = {};
  for (const r in t)
    Array.isArray(t[r]) ? n[r] = [...t[r]] : n[r] = t[r];
  return e && n.tokens.unshift(e), n.generated = !0, n;
};
function c0(t) {
  var d;
  const e = [];
  let n = !1, r, s = null, i = 0, o = !1, a = 0, l = 0, u = Gn(t);
  do {
    if (o = br(u), (o.date || o.general) && (o.int_pattern.length || o.frac_pattern.length || o.scale !== 1 || o.text))
      throw new Error("Illegal format");
    if (o.condition && (l++, n = !0), o.text) {
      if (s)
        throw new Error("Unexpected partition");
      s = o;
    }
    o.locale && (r = ha(o.locale)), e.push(o), i = ((d = u[o.tokensUsed]) == null ? void 0 : d.type) === "break" ? 1 : 0, u = u.slice(o.tokensUsed + i), a++;
  } while (i && a < 4 && l < 3);
  if (i)
    throw new Error("Unexpected partition");
  if (l > 2)
    throw new Error("Unexpected condition");
  const c = e[3];
  if (c && (c.int_pattern.length || c.frac_pattern.length || c.date))
    throw new Error("Unexpected partition");
  if (n) {
    const h = e.length;
    if (h === 1 && (e[1] = br(Gn("General")), e[1].generated = !0), h < 3) {
      const f = e[0], p = e[1];
      if (gi(f), p.condition)
        gi(p);
      else {
        const g = f.condition;
        (g[0] === "=" || g[1] >= 0 && (g[0] === ">" || g[0] === ">=")) && p.tokens.unshift({
          type: "minus",
          volatile: !0
        });
      }
    } else
      e.forEach(gi);
  } else {
    if (e.length < 4 && s)
      for (let h = 0, f = e.length; h < f; h++)
        e[h] === s && e.splice(h, 1);
    if (e.length < 1 && s && (e[0] = br(Gn("General")), e[0].generated = !0), e.length < 2) {
      const h = { type: "minus", volatile: !0 };
      e.push(Al(e[0], h));
    }
    if (e.length < 3 && e.push(Al(e[0])), e.length < 4)
      if (s)
        e.push(s);
      else {
        const h = br(Gn("@"));
        h.generated = !0, e.push(h);
      }
    e[0].condition = [">", 0], e[1].condition = ["<", 0], e[2].condition = null;
  }
  return {
    pattern: t,
    partitions: e,
    locale: r
  };
}
const Nl = /* @__PURE__ */ Object.create({});
function En(t, e = !1) {
  t || (t = "General");
  let n = Nl[t];
  if (!n)
    try {
      n = c0(t), Nl[t] = n;
    } catch (r) {
      if (e)
        throw r;
      const s = {
        tokens: [{ type: "error" }],
        error: r.message
      };
      n = {
        pattern: t,
        partitions: [s, s, s, s],
        error: r.message,
        locale: null
      };
    }
  return n;
}
function d0(t, e, n = {}) {
  const r = Object.assign({}, bc, n), s = En(t, r.throws), i = ma(e, r) ?? e;
  return t0(i, s, r);
}
function h0(t, e, n) {
  const r = Object.assign({}, bc, n), s = En(t, r.throws), i = ma(e, r) ?? e;
  return qm(i, s, r);
}
function f0(t) {
  const e = En(t, !1);
  return Fc(e.partitions);
}
function p0(t) {
  const e = En(t, !1);
  return xc(e.partitions);
}
function g0(t) {
  const e = En(t, !1);
  return Uc(e.partitions);
}
function m0(t) {
  try {
    return En(t, !0), !0;
  } catch {
    return !1;
  }
}
function _0(t, e = {}) {
  const n = En(t, !1);
  return n.info || (n.info = r0(n.partitions, e == null ? void 0 : e.currency)), n.info;
}
function y0(t) {
  const e = En(t, !1);
  return e.dateInfo || (e.dateInfo = s0(e.partitions)), e.dateInfo;
}
const jn = Object.freeze({
  AMPM: sa,
  BREAK: Go,
  CALENDAR: Qo,
  CHAR: Gs,
  COLOR: ra,
  COMMA: Vo,
  CONDITION: qo,
  DATETIME: Jo,
  DBNUM: ta,
  DIGIT: Vs,
  DURATION: Zo,
  ERROR: Pr,
  ESCAPED: ia,
  EXP: la,
  FILL: ua,
  GENERAL: Ho,
  GROUP: Ur,
  HASH: jo,
  LOCALE: na,
  MINUS: zo,
  MODIFIER: _c,
  NATNUM: ea,
  PAREN: ca,
  PERCENT: Xo,
  PLUS: Yo,
  POINT: Ds,
  QMARK: $o,
  SCALE: Ns,
  SKIP: aa,
  SLASH: Wo,
  SPACE: Ko,
  STRING: oa,
  TEXT: Ws,
  ZERO: Kn
}), Lv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addLocale: B,
  dateFromSerial: Bm,
  dateToSerial: ma,
  dec2frac: Ic,
  format: d0,
  formatColor: h0,
  getFormatDateInfo: y0,
  getFormatInfo: _0,
  getLocale: ar,
  isDateFormat: f0,
  isPercentFormat: p0,
  isTextFormat: g0,
  isValidFormat: m0,
  parseBool: Nc,
  parseDate: ya,
  parseLocale: da,
  parseNumber: _a,
  parseTime: Ys,
  parseValue: zm,
  round: Ne,
  tokenTypes: jn,
  tokenize: Gn
}, Symbol.toStringTag, { value: "Module" }));
var Pc = { exports: {} };
(function(t, e) {
  (function(n, r) {
    t.exports = r();
  })(Vt, function() {
    return function(n, r) {
      var s = r.prototype, i = s.format;
      s.format = function(o) {
        var a = this, l = this.$locale();
        if (!this.isValid()) return i.bind(this)(o);
        var u = this.$utils(), c = (o || "YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g, function(d) {
          switch (d) {
            case "Q":
              return Math.ceil((a.$M + 1) / 3);
            case "Do":
              return l.ordinal(a.$D);
            case "gggg":
              return a.weekYear();
            case "GGGG":
              return a.isoWeekYear();
            case "wo":
              return l.ordinal(a.week(), "W");
            case "w":
            case "ww":
              return u.s(a.week(), d === "w" ? 1 : 2, "0");
            case "W":
            case "WW":
              return u.s(a.isoWeek(), d === "W" ? 1 : 2, "0");
            case "k":
            case "kk":
              return u.s(String(a.$H === 0 ? 24 : a.$H), d === "k" ? 1 : 2, "0");
            case "X":
              return Math.floor(a.$d.getTime() / 1e3);
            case "x":
              return a.$d.getTime();
            case "z":
              return "[" + a.offsetName() + "]";
            case "zzz":
              return "[" + a.offsetName("long") + "]";
            default:
              return d;
          }
        });
        return i.bind(this)(c);
      };
    };
  });
})(Pc);
var E0 = Pc.exports;
const v0 = /* @__PURE__ */ Je(E0);
var kc = { exports: {} };
(function(t, e) {
  (function(n, r) {
    t.exports = r();
  })(Vt, function() {
    var n = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, r = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, s = /\d/, i = /\d\d/, o = /\d\d?/, a = /\d*[^-_:/,()\s\d]+/, l = {}, u = function(_) {
      return (_ = +_) + (_ > 68 ? 1900 : 2e3);
    }, c = function(_) {
      return function(C) {
        this[_] = +C;
      };
    }, d = [/[+-]\d\d:?(\d\d)?|Z/, function(_) {
      (this.zone || (this.zone = {})).offset = function(C) {
        if (!C || C === "Z") return 0;
        var S = C.match(/([+-]|\d\d)/g), T = 60 * S[1] + (+S[2] || 0);
        return T === 0 ? 0 : S[0] === "+" ? -T : T;
      }(_);
    }], h = function(_) {
      var C = l[_];
      return C && (C.indexOf ? C : C.s.concat(C.f));
    }, f = function(_, C) {
      var S, T = l.meridiem;
      if (T) {
        for (var w = 1; w <= 24; w += 1) if (_.indexOf(T(w, 0, C)) > -1) {
          S = w > 12;
          break;
        }
      } else S = _ === (C ? "pm" : "PM");
      return S;
    }, p = { A: [a, function(_) {
      this.afternoon = f(_, !1);
    }], a: [a, function(_) {
      this.afternoon = f(_, !0);
    }], Q: [s, function(_) {
      this.month = 3 * (_ - 1) + 1;
    }], S: [s, function(_) {
      this.milliseconds = 100 * +_;
    }], SS: [i, function(_) {
      this.milliseconds = 10 * +_;
    }], SSS: [/\d{3}/, function(_) {
      this.milliseconds = +_;
    }], s: [o, c("seconds")], ss: [o, c("seconds")], m: [o, c("minutes")], mm: [o, c("minutes")], H: [o, c("hours")], h: [o, c("hours")], HH: [o, c("hours")], hh: [o, c("hours")], D: [o, c("day")], DD: [i, c("day")], Do: [a, function(_) {
      var C = l.ordinal, S = _.match(/\d+/);
      if (this.day = S[0], C) for (var T = 1; T <= 31; T += 1) C(T).replace(/\[|\]/g, "") === _ && (this.day = T);
    }], w: [o, c("week")], ww: [i, c("week")], M: [o, c("month")], MM: [i, c("month")], MMM: [a, function(_) {
      var C = h("months"), S = (h("monthsShort") || C.map(function(T) {
        return T.slice(0, 3);
      })).indexOf(_) + 1;
      if (S < 1) throw new Error();
      this.month = S % 12 || S;
    }], MMMM: [a, function(_) {
      var C = h("months").indexOf(_) + 1;
      if (C < 1) throw new Error();
      this.month = C % 12 || C;
    }], Y: [/[+-]?\d+/, c("year")], YY: [i, function(_) {
      this.year = u(_);
    }], YYYY: [/\d{4}/, c("year")], Z: d, ZZ: d };
    function g(_) {
      var C, S;
      C = _, S = l && l.formats;
      for (var T = (_ = C.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(L, N, ut) {
        var ct = ut && ut.toUpperCase();
        return N || S[ut] || n[ut] || S[ct].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(st, K, dt) {
          return K || dt.slice(1);
        });
      })).match(r), w = T.length, E = 0; E < w; E += 1) {
        var v = T[E], R = p[v], I = R && R[0], A = R && R[1];
        T[E] = A ? { regex: I, parser: A } : v.replace(/^\[|\]$/g, "");
      }
      return function(L) {
        for (var N = {}, ut = 0, ct = 0; ut < w; ut += 1) {
          var st = T[ut];
          if (typeof st == "string") ct += st.length;
          else {
            var K = st.regex, dt = st.parser, lt = L.slice(ct), rt = K.exec(lt)[0];
            dt.call(N, rt), L = L.replace(rt, "");
          }
        }
        return function(Xt) {
          var _t = Xt.afternoon;
          if (_t !== void 0) {
            var At = Xt.hours;
            _t ? At < 12 && (Xt.hours += 12) : At === 12 && (Xt.hours = 0), delete Xt.afternoon;
          }
        }(N), N;
      };
    }
    return function(_, C, S) {
      S.p.customParseFormat = !0, _ && _.parseTwoDigitYear && (u = _.parseTwoDigitYear);
      var T = C.prototype, w = T.parse;
      T.parse = function(E) {
        var v = E.date, R = E.utc, I = E.args;
        this.$u = R;
        var A = I[1];
        if (typeof A == "string") {
          var L = I[2] === !0, N = I[3] === !0, ut = L || N, ct = I[2];
          N && (ct = I[2]), l = this.$locale(), !L && ct && (l = S.Ls[ct]), this.$d = function(lt, rt, Xt, _t) {
            try {
              if (["x", "X"].indexOf(rt) > -1) return new Date((rt === "X" ? 1e3 : 1) * lt);
              var At = g(rt)(lt), Jt = At.year, le = At.month, un = At.day, b = At.hours, O = At.minutes, U = At.seconds, W = At.milliseconds, k = At.zone, $ = At.week, et = /* @__PURE__ */ new Date(), J = un || (Jt || le ? 1 : et.getDate()), D = Jt || et.getFullYear(), F = 0;
              Jt && !le || (F = le > 0 ? le - 1 : et.getMonth());
              var P, H = b || 0, q = O || 0, it = U || 0, M = W || 0;
              return k ? new Date(Date.UTC(D, F, J, H, q, it, M + 60 * k.offset * 1e3)) : Xt ? new Date(Date.UTC(D, F, J, H, q, it, M)) : (P = new Date(D, F, J, H, q, it, M), $ && (P = _t(P).week($).toDate()), P);
            } catch {
              return /* @__PURE__ */ new Date("");
            }
          }(v, A, R, S), this.init(), ct && ct !== !0 && (this.$L = this.locale(ct).$L), ut && v != this.format(A) && (this.$d = /* @__PURE__ */ new Date("")), l = {};
        } else if (A instanceof Array) for (var st = A.length, K = 1; K <= st; K += 1) {
          I[1] = A[K - 1];
          var dt = S.apply(this, I);
          if (dt.isValid()) {
            this.$d = dt.$d, this.$L = dt.$L, this.init();
            break;
          }
          K === st && (this.$d = /* @__PURE__ */ new Date(""));
        }
        else w.call(this, E);
      };
    };
  });
})(kc);
var C0 = kc.exports;
const R0 = /* @__PURE__ */ Je(C0);
var Bc = { exports: {} };
(function(t, e) {
  (function(n, r) {
    t.exports = r();
  })(Vt, function() {
    return function(n, r, s) {
      var i = r.prototype, o = function(d) {
        return d && (d.indexOf ? d : d.s);
      }, a = function(d, h, f, p, g) {
        var _ = d.name ? d : d.$locale(), C = o(_[h]), S = o(_[f]), T = C || S.map(function(E) {
          return E.slice(0, p);
        });
        if (!g) return T;
        var w = _.weekStart;
        return T.map(function(E, v) {
          return T[(v + (w || 0)) % 7];
        });
      }, l = function() {
        return s.Ls[s.locale()];
      }, u = function(d, h) {
        return d.formats[h] || function(f) {
          return f.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(p, g, _) {
            return g || _.slice(1);
          });
        }(d.formats[h.toUpperCase()]);
      }, c = function() {
        var d = this;
        return { months: function(h) {
          return h ? h.format("MMMM") : a(d, "months");
        }, monthsShort: function(h) {
          return h ? h.format("MMM") : a(d, "monthsShort", "months", 3);
        }, firstDayOfWeek: function() {
          return d.$locale().weekStart || 0;
        }, weekdays: function(h) {
          return h ? h.format("dddd") : a(d, "weekdays");
        }, weekdaysMin: function(h) {
          return h ? h.format("dd") : a(d, "weekdaysMin", "weekdays", 2);
        }, weekdaysShort: function(h) {
          return h ? h.format("ddd") : a(d, "weekdaysShort", "weekdays", 3);
        }, longDateFormat: function(h) {
          return u(d.$locale(), h);
        }, meridiem: this.$locale().meridiem, ordinal: this.$locale().ordinal };
      };
      i.localeData = function() {
        return c.bind(this)();
      }, s.localeData = function() {
        var d = l();
        return { firstDayOfWeek: function() {
          return d.weekStart || 0;
        }, weekdays: function() {
          return s.weekdays();
        }, weekdaysShort: function() {
          return s.weekdaysShort();
        }, weekdaysMin: function() {
          return s.weekdaysMin();
        }, months: function() {
          return s.months();
        }, monthsShort: function() {
          return s.monthsShort();
        }, longDateFormat: function(h) {
          return u(d, h);
        }, meridiem: d.meridiem, ordinal: d.ordinal };
      }, s.months = function() {
        return a(l(), "months");
      }, s.monthsShort = function() {
        return a(l(), "monthsShort", "months", 3);
      }, s.weekdays = function(d) {
        return a(l(), "weekdays", null, null, d);
      }, s.weekdaysShort = function(d) {
        return a(l(), "weekdaysShort", "weekdays", 3, d);
      }, s.weekdaysMin = function(d) {
        return a(l(), "weekdaysMin", "weekdays", 2, d);
      };
    };
  });
})(Bc);
var b0 = Bc.exports;
const I0 = /* @__PURE__ */ Je(b0);
var Hc = { exports: {} };
(function(t, e) {
  (function(n, r) {
    t.exports = r();
  })(Vt, function() {
    var n = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" };
    return function(r, s, i) {
      var o = s.prototype, a = o.format;
      i.en.formats = n, o.format = function(l) {
        l === void 0 && (l = "YYYY-MM-DDTHH:mm:ssZ");
        var u = this.$locale().formats, c = function(d, h) {
          return d.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(f, p, g) {
            var _ = g && g.toUpperCase();
            return p || h[g] || n[g] || h[_].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(C, S, T) {
              return S || T.slice(1);
            });
          });
        }(l, u === void 0 ? {} : u);
        return a.call(this, c);
      };
    };
  });
})(Hc);
var T0 = Hc.exports;
const S0 = /* @__PURE__ */ Je(T0);
var jc = { exports: {} };
(function(t, e) {
  (function(n, r) {
    t.exports = r();
  })(Vt, function() {
    var n = "minute", r = /[+-]\d\d(?::?\d\d)?/g, s = /([+-]|\d\d)/g;
    return function(i, o, a) {
      var l = o.prototype;
      a.utc = function(g) {
        var _ = { date: g, utc: !0, args: arguments };
        return new o(_);
      }, l.utc = function(g) {
        var _ = a(this.toDate(), { locale: this.$L, utc: !0 });
        return g ? _.add(this.utcOffset(), n) : _;
      }, l.local = function() {
        return a(this.toDate(), { locale: this.$L, utc: !1 });
      };
      var u = l.parse;
      l.parse = function(g) {
        g.utc && (this.$u = !0), this.$utils().u(g.$offset) || (this.$offset = g.$offset), u.call(this, g);
      };
      var c = l.init;
      l.init = function() {
        if (this.$u) {
          var g = this.$d;
          this.$y = g.getUTCFullYear(), this.$M = g.getUTCMonth(), this.$D = g.getUTCDate(), this.$W = g.getUTCDay(), this.$H = g.getUTCHours(), this.$m = g.getUTCMinutes(), this.$s = g.getUTCSeconds(), this.$ms = g.getUTCMilliseconds();
        } else c.call(this);
      };
      var d = l.utcOffset;
      l.utcOffset = function(g, _) {
        var C = this.$utils().u;
        if (C(g)) return this.$u ? 0 : C(this.$offset) ? d.call(this) : this.$offset;
        if (typeof g == "string" && (g = function(E) {
          E === void 0 && (E = "");
          var v = E.match(r);
          if (!v) return null;
          var R = ("" + v[0]).match(s) || ["-", 0, 0], I = R[0], A = 60 * +R[1] + +R[2];
          return A === 0 ? 0 : I === "+" ? A : -A;
        }(g), g === null)) return this;
        var S = Math.abs(g) <= 16 ? 60 * g : g;
        if (S === 0) return this.utc(_);
        var T = this.clone();
        if (_) return T.$offset = S, T.$u = !1, T;
        var w = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
        return (T = this.local().add(S + w, n)).$offset = S, T.$x.$localOffset = w, T;
      };
      var h = l.format;
      l.format = function(g) {
        var _ = g || (this.$u ? "YYYY-MM-DDTHH:mm:ss[Z]" : "");
        return h.call(this, _);
      }, l.valueOf = function() {
        var g = this.$utils().u(this.$offset) ? 0 : this.$offset + (this.$x.$localOffset || this.$d.getTimezoneOffset());
        return this.$d.valueOf() - 6e4 * g;
      }, l.isUTC = function() {
        return !!this.$u;
      }, l.toISOString = function() {
        return this.toDate().toISOString();
      }, l.toString = function() {
        return this.toDate().toUTCString();
      };
      var f = l.toDate;
      l.toDate = function(g) {
        return g === "s" && this.$offset ? a(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate() : f.call(this);
      };
      var p = l.diff;
      l.diff = function(g, _, C) {
        if (g && this.$u === g.$u) return p.call(this, g, _, C);
        var S = this.local(), T = a(g).local();
        return p.call(S, T, _, C);
      };
    };
  });
})(jc);
var w0 = jc.exports;
const O0 = /* @__PURE__ */ Je(w0);
var $c = { exports: {} };
(function(t, e) {
  (function(n, r) {
    t.exports = r();
  })(Vt, function() {
    return function(n, r) {
      r.prototype.weekday = function(s) {
        var i = this.$locale().weekStart || 0, o = this.$W, a = (o < i ? o + 7 : o) - i;
        return this.$utils().u(s) ? a : this.subtract(a, "day").add(s, "day");
      };
    };
  });
})($c);
var A0 = $c.exports;
const N0 = /* @__PURE__ */ Je(A0);
var Wc = { exports: {} };
(function(t, e) {
  (function(n, r) {
    t.exports = r();
  })(Vt, function() {
    var n = "week", r = "year";
    return function(s, i, o) {
      var a = i.prototype;
      a.week = function(l) {
        if (l === void 0 && (l = null), l !== null) return this.add(7 * (l - this.week()), "day");
        var u = this.$locale().yearStart || 1;
        if (this.month() === 11 && this.date() > 25) {
          var c = o(this).startOf(r).add(1, r).date(u), d = o(this).endOf(n);
          if (c.isBefore(d)) return 1;
        }
        var h = o(this).startOf(r).date(u).startOf(n).subtract(1, "millisecond"), f = this.diff(h, n, !0);
        return f < 0 ? o(this).startOf("week").week() : Math.ceil(f);
      }, a.weeks = function(l) {
        return l === void 0 && (l = null), this.week(l);
      };
    };
  });
})(Wc);
var D0 = Wc.exports;
const M0 = /* @__PURE__ */ Je(D0);
var Vc = { exports: {} };
(function(t, e) {
  (function(n, r) {
    t.exports = r();
  })(Vt, function() {
    return function(n, r) {
      r.prototype.weekYear = function() {
        var s = this.month(), i = this.week(), o = this.year();
        return i === 1 && s === 11 ? o + 1 : s === 0 && i >= 52 ? o - 1 : o;
      };
    };
  });
})(Vc);
var L0 = Vc.exports;
const x0 = /* @__PURE__ */ Je(L0);
function Gc(t, e, n = 0, r = t.length - 1, s = F0) {
  for (; r > n; ) {
    if (r - n > 600) {
      const l = r - n + 1, u = e - n + 1, c = Math.log(l), d = 0.5 * Math.exp(2 * c / 3), h = 0.5 * Math.sqrt(c * d * (l - d) / l) * (u - l / 2 < 0 ? -1 : 1), f = Math.max(n, Math.floor(e - u * d / l + h)), p = Math.min(r, Math.floor(e + (l - u) * d / l + h));
      Gc(t, e, f, p, s);
    }
    const i = t[e];
    let o = n, a = r;
    for (fr(t, n, e), s(t[r], i) > 0 && fr(t, n, r); o < a; ) {
      for (fr(t, o, a), o++, a--; s(t[o], i) < 0; ) o++;
      for (; s(t[a], i) > 0; ) a--;
    }
    s(t[n], i) === 0 ? fr(t, n, a) : (a++, fr(t, a, r)), a <= e && (n = a + 1), e <= a && (r = a - 1);
  }
}
function fr(t, e, n) {
  const r = t[e];
  t[e] = t[n], t[n] = r;
}
function F0(t, e) {
  return t < e ? -1 : t > e ? 1 : 0;
}
class Hi {
  constructor(e = 9) {
    this._maxEntries = Math.max(4, e), this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4)), this.clear();
  }
  all() {
    return this._all(this.data, []);
  }
  search(e) {
    let n = this.data;
    const r = [];
    if (!Zr(e, n)) return r;
    const s = this.toBBox, i = [];
    for (; n; ) {
      for (let o = 0; o < n.children.length; o++) {
        const a = n.children[o], l = n.leaf ? s(a) : a;
        Zr(e, l) && (n.leaf ? r.push(a) : _i(e, l) ? this._all(a, r) : i.push(a));
      }
      n = i.pop();
    }
    return r;
  }
  collides(e) {
    let n = this.data;
    if (!Zr(e, n)) return !1;
    const r = [];
    for (; n; ) {
      for (let s = 0; s < n.children.length; s++) {
        const i = n.children[s], o = n.leaf ? this.toBBox(i) : i;
        if (Zr(e, o)) {
          if (n.leaf || _i(e, o)) return !0;
          r.push(i);
        }
      }
      n = r.pop();
    }
    return !1;
  }
  load(e) {
    if (!(e && e.length)) return this;
    if (e.length < this._minEntries) {
      for (let r = 0; r < e.length; r++)
        this.insert(e[r]);
      return this;
    }
    let n = this._build(e.slice(), 0, e.length - 1, 0);
    if (!this.data.children.length)
      this.data = n;
    else if (this.data.height === n.height)
      this._splitRoot(this.data, n);
    else {
      if (this.data.height < n.height) {
        const r = this.data;
        this.data = n, n = r;
      }
      this._insert(n, this.data.height - n.height - 1, !0);
    }
    return this;
  }
  insert(e) {
    return e && this._insert(e, this.data.height - 1), this;
  }
  clear() {
    return this.data = $n([]), this;
  }
  remove(e, n) {
    if (!e) return this;
    let r = this.data;
    const s = this.toBBox(e), i = [], o = [];
    let a, l, u;
    for (; r || i.length; ) {
      if (r || (r = i.pop(), l = i[i.length - 1], a = o.pop(), u = !0), r.leaf) {
        const c = U0(e, r.children, n);
        if (c !== -1)
          return r.children.splice(c, 1), i.push(r), this._condense(i), this;
      }
      !u && !r.leaf && _i(r, s) ? (i.push(r), o.push(a), a = 0, l = r, r = r.children[0]) : l ? (a++, r = l.children[a], u = !1) : r = null;
    }
    return this;
  }
  toBBox(e) {
    return e;
  }
  compareMinX(e, n) {
    return e.minX - n.minX;
  }
  compareMinY(e, n) {
    return e.minY - n.minY;
  }
  toJSON() {
    return this.data;
  }
  fromJSON(e) {
    return this.data = e, this;
  }
  _all(e, n) {
    const r = [];
    for (; e; )
      e.leaf ? n.push(...e.children) : r.push(...e.children), e = r.pop();
    return n;
  }
  _build(e, n, r, s) {
    const i = r - n + 1;
    let o = this._maxEntries, a;
    if (i <= o)
      return a = $n(e.slice(n, r + 1)), Pn(a, this.toBBox), a;
    s || (s = Math.ceil(Math.log(i) / Math.log(o)), o = Math.ceil(i / Math.pow(o, s - 1))), a = $n([]), a.leaf = !1, a.height = s;
    const l = Math.ceil(i / o), u = l * Math.ceil(Math.sqrt(o));
    Dl(e, n, r, u, this.compareMinX);
    for (let c = n; c <= r; c += u) {
      const d = Math.min(c + u - 1, r);
      Dl(e, c, d, l, this.compareMinY);
      for (let h = c; h <= d; h += l) {
        const f = Math.min(h + l - 1, d);
        a.children.push(this._build(e, h, f, s - 1));
      }
    }
    return Pn(a, this.toBBox), a;
  }
  _chooseSubtree(e, n, r, s) {
    for (; s.push(n), !(n.leaf || s.length - 1 === r); ) {
      let i = 1 / 0, o = 1 / 0, a;
      for (let l = 0; l < n.children.length; l++) {
        const u = n.children[l], c = mi(u), d = B0(e, u) - c;
        d < o ? (o = d, i = c < i ? c : i, a = u) : d === o && c < i && (i = c, a = u);
      }
      n = a || n.children[0];
    }
    return n;
  }
  _insert(e, n, r) {
    const s = r ? e : this.toBBox(e), i = [], o = this._chooseSubtree(s, this.data, n, i);
    for (o.children.push(e), Tr(o, s); n >= 0 && i[n].children.length > this._maxEntries; )
      this._split(i, n), n--;
    this._adjustParentBBoxes(s, i, n);
  }
  // split overflowed node into two
  _split(e, n) {
    const r = e[n], s = r.children.length, i = this._minEntries;
    this._chooseSplitAxis(r, i, s);
    const o = this._chooseSplitIndex(r, i, s), a = $n(r.children.splice(o, r.children.length - o));
    a.height = r.height, a.leaf = r.leaf, Pn(r, this.toBBox), Pn(a, this.toBBox), n ? e[n - 1].children.push(a) : this._splitRoot(r, a);
  }
  _splitRoot(e, n) {
    this.data = $n([e, n]), this.data.height = e.height + 1, this.data.leaf = !1, Pn(this.data, this.toBBox);
  }
  _chooseSplitIndex(e, n, r) {
    let s, i = 1 / 0, o = 1 / 0;
    for (let a = n; a <= r - n; a++) {
      const l = Ir(e, 0, a, this.toBBox), u = Ir(e, a, r, this.toBBox), c = H0(l, u), d = mi(l) + mi(u);
      c < i ? (i = c, s = a, o = d < o ? d : o) : c === i && d < o && (o = d, s = a);
    }
    return s || r - n;
  }
  // sorts node children by the best axis for split
  _chooseSplitAxis(e, n, r) {
    const s = e.leaf ? this.compareMinX : P0, i = e.leaf ? this.compareMinY : k0, o = this._allDistMargin(e, n, r, s), a = this._allDistMargin(e, n, r, i);
    o < a && e.children.sort(s);
  }
  // total margin of all possible split distributions where each node is at least m full
  _allDistMargin(e, n, r, s) {
    e.children.sort(s);
    const i = this.toBBox, o = Ir(e, 0, n, i), a = Ir(e, r - n, r, i);
    let l = Jr(o) + Jr(a);
    for (let u = n; u < r - n; u++) {
      const c = e.children[u];
      Tr(o, e.leaf ? i(c) : c), l += Jr(o);
    }
    for (let u = r - n - 1; u >= n; u--) {
      const c = e.children[u];
      Tr(a, e.leaf ? i(c) : c), l += Jr(a);
    }
    return l;
  }
  _adjustParentBBoxes(e, n, r) {
    for (let s = r; s >= 0; s--)
      Tr(n[s], e);
  }
  _condense(e) {
    for (let n = e.length - 1, r; n >= 0; n--)
      e[n].children.length === 0 ? n > 0 ? (r = e[n - 1].children, r.splice(r.indexOf(e[n]), 1)) : this.clear() : Pn(e[n], this.toBBox);
  }
}
function U0(t, e, n) {
  if (!n) return e.indexOf(t);
  for (let r = 0; r < e.length; r++)
    if (n(t, e[r])) return r;
  return -1;
}
function Pn(t, e) {
  Ir(t, 0, t.children.length, e, t);
}
function Ir(t, e, n, r, s) {
  s || (s = $n(null)), s.minX = 1 / 0, s.minY = 1 / 0, s.maxX = -1 / 0, s.maxY = -1 / 0;
  for (let i = e; i < n; i++) {
    const o = t.children[i];
    Tr(s, t.leaf ? r(o) : o);
  }
  return s;
}
function Tr(t, e) {
  return t.minX = Math.min(t.minX, e.minX), t.minY = Math.min(t.minY, e.minY), t.maxX = Math.max(t.maxX, e.maxX), t.maxY = Math.max(t.maxY, e.maxY), t;
}
function P0(t, e) {
  return t.minX - e.minX;
}
function k0(t, e) {
  return t.minY - e.minY;
}
function mi(t) {
  return (t.maxX - t.minX) * (t.maxY - t.minY);
}
function Jr(t) {
  return t.maxX - t.minX + (t.maxY - t.minY);
}
function B0(t, e) {
  return (Math.max(e.maxX, t.maxX) - Math.min(e.minX, t.minX)) * (Math.max(e.maxY, t.maxY) - Math.min(e.minY, t.minY));
}
function H0(t, e) {
  const n = Math.max(t.minX, e.minX), r = Math.max(t.minY, e.minY), s = Math.min(t.maxX, e.maxX), i = Math.min(t.maxY, e.maxY);
  return Math.max(0, s - n) * Math.max(0, i - r);
}
function _i(t, e) {
  return t.minX <= e.minX && t.minY <= e.minY && e.maxX <= t.maxX && e.maxY <= t.maxY;
}
function Zr(t, e) {
  return e.minX <= t.maxX && e.minY <= t.maxY && e.maxX >= t.minX && e.maxY >= t.minY;
}
function $n(t) {
  return {
    children: t,
    height: 1,
    leaf: !0,
    minX: 1 / 0,
    minY: 1 / 0,
    maxX: -1 / 0,
    maxY: -1 / 0
  };
}
function Dl(t, e, n, r, s) {
  const i = [e, n];
  for (; i.length; ) {
    if (n = i.pop(), e = i.pop(), n - e <= r) continue;
    const o = e + Math.ceil((n - e) / r / 2) * r;
    Gc(t, o, e, n, s), i.push(e, o, o, n);
  }
}
var be = -1, ge = 1, ee = 0;
function kr(t, e, n, r, s) {
  if (t === e)
    return t ? [[ee, t]] : [];
  if (n != null) {
    var i = X0(t, e, n);
    if (i)
      return i;
  }
  var o = Ea(t, e), a = t.substring(0, o);
  t = t.substring(o), e = e.substring(o), o = zs(t, e);
  var l = t.substring(t.length - o);
  t = t.substring(0, t.length - o), e = e.substring(0, e.length - o);
  var u = j0(t, e);
  return a && u.unshift([ee, a]), l && u.push([ee, l]), va(u, s), r && V0(u), u;
}
function j0(t, e) {
  var n;
  if (!t)
    return [[ge, e]];
  if (!e)
    return [[be, t]];
  var r = t.length > e.length ? t : e, s = t.length > e.length ? e : t, i = r.indexOf(s);
  if (i !== -1)
    return n = [
      [ge, r.substring(0, i)],
      [ee, s],
      [ge, r.substring(i + s.length)]
    ], t.length > e.length && (n[0][0] = n[2][0] = be), n;
  if (s.length === 1)
    return [
      [be, t],
      [ge, e]
    ];
  var o = W0(t, e);
  if (o) {
    var a = o[0], l = o[1], u = o[2], c = o[3], d = o[4], h = kr(a, u), f = kr(l, c);
    return h.concat([[ee, d]], f);
  }
  return $0(t, e);
}
function $0(t, e) {
  for (var n = t.length, r = e.length, s = Math.ceil((n + r) / 2), i = s, o = 2 * s, a = new Array(o), l = new Array(o), u = 0; u < o; u++)
    a[u] = -1, l[u] = -1;
  a[i + 1] = 0, l[i + 1] = 0;
  for (var c = n - r, d = c % 2 !== 0, h = 0, f = 0, p = 0, g = 0, _ = 0; _ < s; _++) {
    for (var C = -_ + h; C <= _ - f; C += 2) {
      var S = i + C, T;
      C === -_ || C !== _ && a[S - 1] < a[S + 1] ? T = a[S + 1] : T = a[S - 1] + 1;
      for (var w = T - C; T < n && w < r && t.charAt(T) === e.charAt(w); )
        T++, w++;
      if (a[S] = T, T > n)
        f += 2;
      else if (w > r)
        h += 2;
      else if (d) {
        var E = i + c - C;
        if (E >= 0 && E < o && l[E] !== -1) {
          var v = n - l[E];
          if (T >= v)
            return Ml(t, e, T, w);
        }
      }
    }
    for (var R = -_ + p; R <= _ - g; R += 2) {
      var E = i + R, v;
      R === -_ || R !== _ && l[E - 1] < l[E + 1] ? v = l[E + 1] : v = l[E - 1] + 1;
      for (var I = v - R; v < n && I < r && t.charAt(n - v - 1) === e.charAt(r - I - 1); )
        v++, I++;
      if (l[E] = v, v > n)
        g += 2;
      else if (I > r)
        p += 2;
      else if (!d) {
        var S = i + c - R;
        if (S >= 0 && S < o && a[S] !== -1) {
          var T = a[S], w = i + T - S;
          if (v = n - v, T >= v)
            return Ml(t, e, T, w);
        }
      }
    }
  }
  return [
    [be, t],
    [ge, e]
  ];
}
function Ml(t, e, n, r) {
  var s = t.substring(0, n), i = e.substring(0, r), o = t.substring(n), a = e.substring(r), l = kr(s, i), u = kr(o, a);
  return l.concat(u);
}
function Ea(t, e) {
  if (!t || !e || t.charAt(0) !== e.charAt(0))
    return 0;
  for (var n = 0, r = Math.min(t.length, e.length), s = r, i = 0; n < s; )
    t.substring(i, s) == e.substring(i, s) ? (n = s, i = n) : r = s, s = Math.floor((r - n) / 2 + n);
  return Yc(t.charCodeAt(s - 1)) && s--, s;
}
function Ll(t, e) {
  var n = t.length, r = e.length;
  if (n == 0 || r == 0)
    return 0;
  n > r ? t = t.substring(n - r) : n < r && (e = e.substring(0, n));
  var s = Math.min(n, r);
  if (t == e)
    return s;
  for (var i = 0, o = 1; ; ) {
    var a = t.substring(s - o), l = e.indexOf(a);
    if (l == -1)
      return i;
    o += l, (l == 0 || t.substring(s - o) == e.substring(0, o)) && (i = o, o++);
  }
}
function zs(t, e) {
  if (!t || !e || t.slice(-1) !== e.slice(-1))
    return 0;
  for (var n = 0, r = Math.min(t.length, e.length), s = r, i = 0; n < s; )
    t.substring(t.length - s, t.length - i) == e.substring(e.length - s, e.length - i) ? (n = s, i = n) : r = s, s = Math.floor((r - n) / 2 + n);
  return zc(t.charCodeAt(t.length - s)) && s--, s;
}
function W0(t, e) {
  var n = t.length > e.length ? t : e, r = t.length > e.length ? e : t;
  if (n.length < 4 || r.length * 2 < n.length)
    return null;
  function s(f, p, g) {
    for (var _ = f.substring(g, g + Math.floor(f.length / 4)), C = -1, S = "", T, w, E, v; (C = p.indexOf(_, C + 1)) !== -1; ) {
      var R = Ea(
        f.substring(g),
        p.substring(C)
      ), I = zs(
        f.substring(0, g),
        p.substring(0, C)
      );
      S.length < I + R && (S = p.substring(C - I, C) + p.substring(C, C + R), T = f.substring(0, g - I), w = f.substring(g + R), E = p.substring(0, C - I), v = p.substring(C + R));
    }
    return S.length * 2 >= f.length ? [
      T,
      w,
      E,
      v,
      S
    ] : null;
  }
  var i = s(
    n,
    r,
    Math.ceil(n.length / 4)
  ), o = s(
    n,
    r,
    Math.ceil(n.length / 2)
  ), a;
  if (!i && !o)
    return null;
  o ? i ? a = i[4].length > o[4].length ? i : o : a = o : a = i;
  var l, u, c, d;
  t.length > e.length ? (l = a[0], u = a[1], c = a[2], d = a[3]) : (c = a[0], d = a[1], l = a[2], u = a[3]);
  var h = a[4];
  return [l, u, c, d, h];
}
function V0(t) {
  for (var e = !1, n = [], r = 0, s = null, i = 0, o = 0, a = 0, l = 0, u = 0; i < t.length; )
    t[i][0] == ee ? (n[r++] = i, o = l, a = u, l = 0, u = 0, s = t[i][1]) : (t[i][0] == ge ? l += t[i][1].length : u += t[i][1].length, s && s.length <= Math.max(o, a) && s.length <= Math.max(l, u) && (t.splice(n[r - 1], 0, [
      be,
      s
    ]), t[n[r - 1] + 1][0] = ge, r--, r--, i = r > 0 ? n[r - 1] : -1, o = 0, a = 0, l = 0, u = 0, s = null, e = !0)), i++;
  for (e && va(t), z0(t), i = 1; i < t.length; ) {
    if (t[i - 1][0] == be && t[i][0] == ge) {
      var c = t[i - 1][1], d = t[i][1], h = Ll(c, d), f = Ll(d, c);
      h >= f ? (h >= c.length / 2 || h >= d.length / 2) && (t.splice(i, 0, [
        ee,
        d.substring(0, h)
      ]), t[i - 1][1] = c.substring(
        0,
        c.length - h
      ), t[i + 1][1] = d.substring(h), i++) : (f >= c.length / 2 || f >= d.length / 2) && (t.splice(i, 0, [
        ee,
        c.substring(0, f)
      ]), t[i - 1][0] = ge, t[i - 1][1] = d.substring(
        0,
        d.length - f
      ), t[i + 1][0] = be, t[i + 1][1] = c.substring(f), i++), i++;
    }
    i++;
  }
}
var xl = /[^a-zA-Z0-9]/, Fl = /\s/, Ul = /[\r\n]/, G0 = /\n\r?\n$/, Y0 = /^\r?\n\r?\n/;
function z0(t) {
  function e(f, p) {
    if (!f || !p)
      return 6;
    var g = f.charAt(f.length - 1), _ = p.charAt(0), C = g.match(xl), S = _.match(xl), T = C && g.match(Fl), w = S && _.match(Fl), E = T && g.match(Ul), v = w && _.match(Ul), R = E && f.match(G0), I = v && p.match(Y0);
    return R || I ? 5 : E || v ? 4 : C && !T && w ? 3 : T || w ? 2 : C || S ? 1 : 0;
  }
  for (var n = 1; n < t.length - 1; ) {
    if (t[n - 1][0] == ee && t[n + 1][0] == ee) {
      var r = t[n - 1][1], s = t[n][1], i = t[n + 1][1], o = zs(r, s);
      if (o) {
        var a = s.substring(s.length - o);
        r = r.substring(0, r.length - o), s = a + s.substring(0, s.length - o), i = a + i;
      }
      for (var l = r, u = s, c = i, d = e(r, s) + e(s, i); s.charAt(0) === i.charAt(0); ) {
        r += s.charAt(0), s = s.substring(1) + i.charAt(0), i = i.substring(1);
        var h = e(r, s) + e(s, i);
        h >= d && (d = h, l = r, u = s, c = i);
      }
      t[n - 1][1] != l && (l ? t[n - 1][1] = l : (t.splice(n - 1, 1), n--), t[n][1] = u, c ? t[n + 1][1] = c : (t.splice(n + 1, 1), n--));
    }
    n++;
  }
}
function va(t, e) {
  t.push([ee, ""]);
  for (var n = 0, r = 0, s = 0, i = "", o = "", a; n < t.length; ) {
    if (n < t.length - 1 && !t[n][1]) {
      t.splice(n, 1);
      continue;
    }
    switch (t[n][0]) {
      case ge:
        s++, o += t[n][1], n++;
        break;
      case be:
        r++, i += t[n][1], n++;
        break;
      case ee:
        var l = n - s - r - 1;
        if (e) {
          if (l >= 0 && Xc(t[l][1])) {
            var u = t[l][1].slice(-1);
            if (t[l][1] = t[l][1].slice(
              0,
              -1
            ), i = u + i, o = u + o, !t[l][1]) {
              t.splice(l, 1), n--;
              var c = l - 1;
              t[c] && t[c][0] === ge && (s++, o = t[c][1] + o, c--), t[c] && t[c][0] === be && (r++, i = t[c][1] + i, c--), l = c;
            }
          }
          if (Kc(t[n][1])) {
            var u = t[n][1].charAt(0);
            t[n][1] = t[n][1].slice(1), i += u, o += u;
          }
        }
        if (n < t.length - 1 && !t[n][1]) {
          t.splice(n, 1);
          break;
        }
        if (i.length > 0 || o.length > 0) {
          i.length > 0 && o.length > 0 && (a = Ea(o, i), a !== 0 && (l >= 0 ? t[l][1] += o.substring(
            0,
            a
          ) : (t.splice(0, 0, [
            ee,
            o.substring(0, a)
          ]), n++), o = o.substring(a), i = i.substring(a)), a = zs(o, i), a !== 0 && (t[n][1] = o.substring(o.length - a) + t[n][1], o = o.substring(
            0,
            o.length - a
          ), i = i.substring(
            0,
            i.length - a
          )));
          var d = s + r;
          i.length === 0 && o.length === 0 ? (t.splice(n - d, d), n = n - d) : i.length === 0 ? (t.splice(n - d, d, [ge, o]), n = n - d + 1) : o.length === 0 ? (t.splice(n - d, d, [be, i]), n = n - d + 1) : (t.splice(
            n - d,
            d,
            [be, i],
            [ge, o]
          ), n = n - d + 2);
        }
        n !== 0 && t[n - 1][0] === ee ? (t[n - 1][1] += t[n][1], t.splice(n, 1)) : n++, s = 0, r = 0, i = "", o = "";
        break;
    }
  }
  t[t.length - 1][1] === "" && t.pop();
  var h = !1;
  for (n = 1; n < t.length - 1; )
    t[n - 1][0] === ee && t[n + 1][0] === ee && (t[n][1].substring(
      t[n][1].length - t[n - 1][1].length
    ) === t[n - 1][1] ? (t[n][1] = t[n - 1][1] + t[n][1].substring(
      0,
      t[n][1].length - t[n - 1][1].length
    ), t[n + 1][1] = t[n - 1][1] + t[n + 1][1], t.splice(n - 1, 1), h = !0) : t[n][1].substring(0, t[n + 1][1].length) == t[n + 1][1] && (t[n - 1][1] += t[n + 1][1], t[n][1] = t[n][1].substring(t[n + 1][1].length) + t[n + 1][1], t.splice(n + 1, 1), h = !0)), n++;
  h && va(t, e);
}
function Yc(t) {
  return t >= 55296 && t <= 56319;
}
function zc(t) {
  return t >= 56320 && t <= 57343;
}
function Kc(t) {
  return zc(t.charCodeAt(0));
}
function Xc(t) {
  return Yc(t.charCodeAt(t.length - 1));
}
function K0(t) {
  for (var e = [], n = 0; n < t.length; n++)
    t[n][1].length > 0 && e.push(t[n]);
  return e;
}
function yi(t, e, n, r) {
  return Xc(t) || Kc(r) ? null : K0([
    [ee, t],
    [be, e],
    [ge, n],
    [ee, r]
  ]);
}
function X0(t, e, n) {
  var r = typeof n == "number" ? { index: n, length: 0 } : n.oldRange, s = typeof n == "number" ? null : n.newRange, i = t.length, o = e.length;
  if (r.length === 0 && (s === null || s.length === 0)) {
    var a = r.index, l = t.slice(0, a), u = t.slice(a), c = s ? s.index : null;
    t: {
      var d = a + o - i;
      if (c !== null && c !== d || d < 0 || d > o)
        break t;
      var h = e.slice(0, d), f = e.slice(d);
      if (f !== u)
        break t;
      var p = Math.min(a, d), g = l.slice(0, p), _ = h.slice(0, p);
      if (g !== _)
        break t;
      var C = l.slice(p), S = h.slice(p);
      return yi(g, C, S, u);
    }
    t: {
      if (c !== null && c !== a)
        break t;
      var T = a, h = e.slice(0, T), f = e.slice(T);
      if (h !== l)
        break t;
      var w = Math.min(i - T, o - T), E = u.slice(u.length - w), v = f.slice(f.length - w);
      if (E !== v)
        break t;
      var C = u.slice(0, u.length - w), S = f.slice(0, f.length - w);
      return yi(l, C, S, E);
    }
  }
  if (r.length > 0 && s && s.length === 0)
    t: {
      var g = t.slice(0, r.index), E = t.slice(r.index + r.length), p = g.length, w = E.length;
      if (o < p + w)
        break t;
      var _ = e.slice(0, p), v = e.slice(o - w);
      if (g !== _ || E !== v)
        break t;
      var C = t.slice(p, i - w), S = e.slice(p, o - w);
      return yi(g, C, S, E);
    }
  return null;
}
function Ks(t, e, n, r) {
  return kr(t, e, n, r, !0);
}
Ks.INSERT = ge;
Ks.DELETE = be;
Ks.EQUAL = ee;
var Q0 = Ks;
const Qc = /* @__PURE__ */ Je(Q0), qr = { white: "#FFFFFF", black: "#000000", primary: { 50: "#F3F5FF", 100: "#E9EDFF", 200: "#D2DAFA", 300: "#BAC6F8", 400: "#6280F9", 500: "#466AF7", 600: "#2C53F1", 700: "#143EE3", 800: "#083AD1", 900: "#1033BF" }, gray: { 50: "#F9FAFB", 100: "#EEEFF1", 200: "#E3E5EA", 300: "#A8B0BD", 400: "#7D8698", 500: "#4E5565", 600: "#31363F", 700: "#272A2F", 800: "#1F2124", 900: "#1B1C1F" }, blue: { 50: "#EBF5FF", 100: "#E1EFFE", 200: "#C3DDFD", 300: "#A4CAFE", 400: "#76A9FA", 500: "#3F83F8", 600: "#1C64F2", 700: "#1A56DB", 800: "#1E429F", 900: "#233876" }, red: { 50: "#FDF2F2", 100: "#FDE8E8", 200: "#FBD5D5", 300: "#F8B4B4", 400: "#F98080", 500: "#F05252", 600: "#E02424", 700: "#C81E1E", 800: "#9B1C1C", 900: "#771D1D" }, orange: { 50: "#FFF8F1", 100: "#FEECDC", 200: "#FCD9BD", 300: "#FDBA8C", 400: "#FF8A4C", 500: "#FF5A1F", 600: "#D03801", 700: "#B43403", 800: "#8A2C0D", 900: "#771D1D" }, yellow: { 50: "#FDFCEA", 100: "#FFF4B9", 200: "#FCDC6A", 300: "#FAC815", 400: "#F1B312", 500: "#D49D0F", 600: "#AB7F0E", 700: "#9A6D15", 800: "#725213", 900: "#634312" }, green: { 50: "#F3FAF7", 100: "#DEF7EC", 200: "#BCF0DA", 300: "#84E1BC", 400: "#31C48D", 500: "#0DA471", 600: "#057A55", 700: "#046C4E", 800: "#03543F", 900: "#014737" }, jiqing: { 50: "#EDFAFA", 100: "#D5F5F6", 200: "#AFECEF", 300: "#7EDCE2", 400: "#16BDCA", 500: "#0694A2", 600: "#047481", 700: "#036672", 800: "#05505C", 900: "#014451" }, indigo: { 50: "#F3F5FF", 100: "#E9EDFF", 200: "#D2DAFA", 300: "#BAC6F8", 400: "#6280F9", 500: "#466AF7", 600: "#2C53F1", 700: "#143EE3", 800: "#083AD1", 900: "#1033BF" }, purple: { 50: "#F6F5FF", 100: "#EDEBFE", 200: "#DCD7FE", 300: "#CABFFD", 400: "#AC94FA", 500: "#9061F9", 600: "#7E3AF2", 700: "#6C2BD9", 800: "#5521B5", 900: "#4A1D96" }, pink: { 50: "#FDF2F8", 100: "#FCE8F3", 200: "#FAD1E8", 300: "#F8B4D9", 400: "#F17EB8", 500: "#E74694", 600: "#D61F69", 700: "#BF125D", 800: "#99154B", 900: "#751A3D" }, "loop-color": { 1: "purple.400", 2: "green.500", 3: "blue.500", 4: "yellow.400", 5: "pink.300", 6: "jiqing.600", 7: "orange.400", 8: "gray.800", 9: "indigo.500", 10: "red.300", 11: "green.600", 12: "yellow.700" } }, xv = { white: "#FFFFFF", black: "#000000", primary: { 50: "#F3FAF7", 100: "#DEF7EC", 200: "#BCF0DA", 300: "#84E1BC", 400: "#31C48D", 500: "#0DA471", 600: "#057A55", 700: "#046C4E", 800: "#03543F", 900: "#014737" }, gray: { 50: "#F9FAFB", 100: "#EEEFF1", 200: "#E3E5EA", 300: "#A8B0BD", 400: "#7D8698", 500: "#4E5565", 600: "#31363F", 700: "#272A2F", 800: "#1F2124", 900: "#1B1C1F" }, blue: { 50: "#EBF5FF", 100: "#E1EFFE", 200: "#C3DDFD", 300: "#A4CAFE", 400: "#76A9FA", 500: "#3F83F8", 600: "#1C64F2", 700: "#1A56DB", 800: "#1E429F", 900: "#233876" }, red: { 50: "#FDF2F2", 100: "#FDE8E8", 200: "#FBD5D5", 300: "#F8B4B4", 400: "#F98080", 500: "#F05252", 600: "#E02424", 700: "#C81E1E", 800: "#9B1C1C", 900: "#771D1D" }, orange: { 50: "#FFF8F1", 100: "#FEECDC", 200: "#FCD9BD", 300: "#FDBA8C", 400: "#FF8A4C", 500: "#FF5A1F", 600: "#D03801", 700: "#B43403", 800: "#8A2C0D", 900: "#771D1D" }, yellow: { 50: "#FDFCEA", 100: "#FFF4B9", 200: "#FCDC6A", 300: "#FAC815", 400: "#F1B312", 500: "#D49D0F", 600: "#AB7F0E", 700: "#9A6D15", 800: "#725213", 900: "#634312" }, green: { 50: "#F3FAF7", 100: "#DEF7EC", 200: "#BCF0DA", 300: "#84E1BC", 400: "#31C48D", 500: "#0DA471", 600: "#057A55", 700: "#046C4E", 800: "#03543F", 900: "#014737" }, jiqing: { 50: "#EDFAFA", 100: "#D5F5F6", 200: "#AFECEF", 300: "#7EDCE2", 400: "#16BDCA", 500: "#0694A2", 600: "#047481", 700: "#036672", 800: "#05505C", 900: "#014451" }, indigo: { 50: "#F3F5FF", 100: "#E9EDFF", 200: "#D2DAFA", 300: "#BAC6F8", 400: "#6280F9", 500: "#466AF7", 600: "#2C53F1", 700: "#143EE3", 800: "#083AD1", 900: "#1033BF" }, purple: { 50: "#F6F5FF", 100: "#EDEBFE", 200: "#DCD7FE", 300: "#CABFFD", 400: "#AC94FA", 500: "#9061F9", 600: "#7E3AF2", 700: "#6C2BD9", 800: "#5521B5", 900: "#4A1D96" }, pink: { 50: "#FDF2F8", 100: "#FCE8F3", 200: "#FAD1E8", 300: "#F8B4D9", 400: "#F17EB8", 500: "#E74694", 600: "#D61F69", 700: "#BF125D", 800: "#99154B", 900: "#751A3D" }, "loop-color": { 1: "purple.400", 2: "green.500", 3: "blue.500", 4: "yellow.400", 5: "pink.300", 6: "jiqing.600", 7: "orange.400", 8: "gray.800", 9: "indigo.500", 10: "red.300", 11: "green.600", 12: "yellow.700" } }, Pl = [
  Int8Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array
], Ei = 1, pr = 8;
class Ca {
  /**
   * Creates an index from raw `ArrayBuffer` data.
   * @param {ArrayBuffer} data
   */
  static from(e) {
    if (!(e instanceof ArrayBuffer))
      throw new Error("Data must be an instance of ArrayBuffer.");
    const [n, r] = new Uint8Array(e, 0, 2);
    if (n !== 219)
      throw new Error("Data does not appear to be in a KDBush format.");
    const s = r >> 4;
    if (s !== Ei)
      throw new Error(`Got v${s} data when expected v${Ei}.`);
    const i = Pl[r & 15];
    if (!i)
      throw new Error("Unrecognized array type.");
    const [o] = new Uint16Array(e, 2, 1), [a] = new Uint32Array(e, 4, 1);
    return new Ca(a, o, i, e);
  }
  /**
   * Creates an index that will hold a given number of items.
   * @param {number} numItems
   * @param {number} [nodeSize=64] Size of the KD-tree node (64 by default).
   * @param {TypedArrayConstructor} [ArrayType=Float64Array] The array type used for coordinates storage (`Float64Array` by default).
   * @param {ArrayBuffer} [data] (For internal use only)
   */
  constructor(e, n = 64, r = Float64Array, s) {
    if (isNaN(e) || e < 0) throw new Error(`Unpexpected numItems value: ${e}.`);
    this.numItems = +e, this.nodeSize = Math.min(Math.max(+n, 2), 65535), this.ArrayType = r, this.IndexArrayType = e < 65536 ? Uint16Array : Uint32Array;
    const i = Pl.indexOf(this.ArrayType), o = e * 2 * this.ArrayType.BYTES_PER_ELEMENT, a = e * this.IndexArrayType.BYTES_PER_ELEMENT, l = (8 - a % 8) % 8;
    if (i < 0)
      throw new Error(`Unexpected typed array class: ${r}.`);
    s && s instanceof ArrayBuffer ? (this.data = s, this.ids = new this.IndexArrayType(this.data, pr, e), this.coords = new this.ArrayType(this.data, pr + a + l, e * 2), this._pos = e * 2, this._finished = !0) : (this.data = new ArrayBuffer(pr + o + a + l), this.ids = new this.IndexArrayType(this.data, pr, e), this.coords = new this.ArrayType(this.data, pr + a + l, e * 2), this._pos = 0, this._finished = !1, new Uint8Array(this.data, 0, 2).set([219, (Ei << 4) + i]), new Uint16Array(this.data, 2, 1)[0] = n, new Uint32Array(this.data, 4, 1)[0] = e);
  }
  /**
   * Add a point to the index.
   * @param {number} x
   * @param {number} y
   * @returns {number} An incremental index associated with the added item (starting from `0`).
   */
  add(e, n) {
    const r = this._pos >> 1;
    return this.ids[r] = r, this.coords[this._pos++] = e, this.coords[this._pos++] = n, r;
  }
  /**
   * Perform indexing of the added points.
   */
  finish() {
    const e = this._pos >> 1;
    if (e !== this.numItems)
      throw new Error(`Added ${e} items when expected ${this.numItems}.`);
    return ji(this.ids, this.coords, this.nodeSize, 0, this.numItems - 1, 0), this._finished = !0, this;
  }
  /**
   * Search the index for items within a given bounding box.
   * @param {number} minX
   * @param {number} minY
   * @param {number} maxX
   * @param {number} maxY
   * @returns {number[]} An array of indices correponding to the found items.
   */
  range(e, n, r, s) {
    if (!this._finished) throw new Error("Data not yet indexed - call index.finish().");
    const { ids: i, coords: o, nodeSize: a } = this, l = [0, i.length - 1, 0], u = [];
    for (; l.length; ) {
      const c = l.pop() || 0, d = l.pop() || 0, h = l.pop() || 0;
      if (d - h <= a) {
        for (let _ = h; _ <= d; _++) {
          const C = o[2 * _], S = o[2 * _ + 1];
          C >= e && C <= r && S >= n && S <= s && u.push(i[_]);
        }
        continue;
      }
      const f = h + d >> 1, p = o[2 * f], g = o[2 * f + 1];
      p >= e && p <= r && g >= n && g <= s && u.push(i[f]), (c === 0 ? e <= p : n <= g) && (l.push(h), l.push(f - 1), l.push(1 - c)), (c === 0 ? r >= p : s >= g) && (l.push(f + 1), l.push(d), l.push(1 - c));
    }
    return u;
  }
  /**
   * Search the index for items within a given radius.
   * @param {number} qx
   * @param {number} qy
   * @param {number} r Query radius.
   * @returns {number[]} An array of indices correponding to the found items.
   */
  within(e, n, r) {
    if (!this._finished) throw new Error("Data not yet indexed - call index.finish().");
    const { ids: s, coords: i, nodeSize: o } = this, a = [0, s.length - 1, 0], l = [], u = r * r;
    for (; a.length; ) {
      const c = a.pop() || 0, d = a.pop() || 0, h = a.pop() || 0;
      if (d - h <= o) {
        for (let _ = h; _ <= d; _++)
          kl(i[2 * _], i[2 * _ + 1], e, n) <= u && l.push(s[_]);
        continue;
      }
      const f = h + d >> 1, p = i[2 * f], g = i[2 * f + 1];
      kl(p, g, e, n) <= u && l.push(s[f]), (c === 0 ? e - r <= p : n - r <= g) && (a.push(h), a.push(f - 1), a.push(1 - c)), (c === 0 ? e + r >= p : n + r >= g) && (a.push(f + 1), a.push(d), a.push(1 - c));
    }
    return l;
  }
}
function ji(t, e, n, r, s, i) {
  if (s - r <= n) return;
  const o = r + s >> 1;
  Jc(t, e, o, r, s, i), ji(t, e, n, r, o - 1, 1 - i), ji(t, e, n, o + 1, s, 1 - i);
}
function Jc(t, e, n, r, s, i) {
  for (; s > r; ) {
    if (s - r > 600) {
      const u = s - r + 1, c = n - r + 1, d = Math.log(u), h = 0.5 * Math.exp(2 * d / 3), f = 0.5 * Math.sqrt(d * h * (u - h) / u) * (c - u / 2 < 0 ? -1 : 1), p = Math.max(r, Math.floor(n - c * h / u + f)), g = Math.min(s, Math.floor(n + (u - c) * h / u + f));
      Jc(t, e, n, p, g, i);
    }
    const o = e[2 * n + i];
    let a = r, l = s;
    for (gr(t, e, r, n), e[2 * s + i] > o && gr(t, e, r, s); a < l; ) {
      for (gr(t, e, a, l), a++, l--; e[2 * a + i] < o; ) a++;
      for (; e[2 * l + i] > o; ) l--;
    }
    e[2 * r + i] === o ? gr(t, e, r, l) : (l++, gr(t, e, l, s)), l <= n && (r = l + 1), n <= l && (s = l - 1);
  }
}
function gr(t, e, n, r) {
  vi(t, n, r), vi(e, 2 * n, 2 * r), vi(e, 2 * n + 1, 2 * r + 1);
}
function vi(t, e, n) {
  const r = t[e];
  t[e] = t[n], t[n] = r;
}
function kl(t, e, n, r) {
  const s = t - n, i = e - r;
  return s * s + i * i;
}
const Ke = typeof global < "u" ? global : typeof self < "u" ? self : window;
function J0() {
  let t = /* @__PURE__ */ new Map(), e = 0;
  typeof Ke.requestIdleCallback != "function" && (Ke.requestIdleCallback = function(n) {
    let r = Date.now(), s = ++e, i = setTimeout(function() {
      t.delete(s);
      let o = Math.max(0, 50 - (Date.now() - r));
      n({ didTimeout: o === 0, timeRemaining() {
        return o;
      } });
    }, 1);
    return t.set(s, i), s;
  }), typeof Ke.cancelIdleCallback != "function" && (Ke.cancelIdleCallback = function(n) {
    let r = t.get(n);
    r !== void 0 && (clearTimeout(r), t.delete(n));
  });
}
function Z0() {
  typeof Ke.Array.prototype.findLastIndex != "function" && (Ke.Array.prototype.findLastIndex = function(t, e) {
    if (this == null) throw TypeError("Array.prototype.findLastIndex called on null or undefined");
    if (typeof t != "function") throw TypeError("callback must be a function");
    let n = this.length >>> 0;
    for (let r = n - 1; r >= 0; r--) if (r in this && t.call(e, this[r], r, this)) return r;
    return -1;
  }), typeof Ke.Array.prototype.findLast != "function" && (Ke.Array.prototype.findLast = function(t, e) {
    let n = this.findLastIndex(t, e);
    return n === -1 ? void 0 : this[n];
  });
}
function q0() {
  typeof Ke.String.prototype.at != "function" && (Ke.String.prototype.at = function(t) {
    if (this == null) throw TypeError("String.prototype.at called on null or undefined");
    let e = this.length;
    if (t < 0 && (t = e + t), !(t < 0 || t >= e)) return this.charAt(t);
  });
}
function t_() {
  J0(), Z0(), q0();
}
function Xs(t, e) {
  let n = t.indexOf(e);
  return n > -1 ? (t.splice(n, 1), !0) : !1;
}
function Fv(t) {
  let e = /* @__PURE__ */ new Set(), n = [];
  for (let r of t) e.has(r) || (e.add(r), n.push(r));
  return n;
}
function Uv(t, e) {
  let n = /* @__PURE__ */ new Set(), r = [];
  for (let s of t) {
    let i = e(s);
    n.has(i) || (n.add(i), r.push(s));
  }
  return r;
}
function e_(t, e) {
  for (let n = t.length - 1; n > -1; n--) {
    let r = t[n];
    if (e(r, n)) return r;
  }
  return null;
}
function Pv(t, e) {
  if (t.length === 0) return t;
  let n = e % t.length;
  return t.slice(n).concat(t.slice(0, n));
}
function kv(t, e) {
  let n = /* @__PURE__ */ new Map();
  return t.forEach((r) => {
    let s = e(r), i = n.get(s);
    n.has(s) || (i = [], n.set(s, i)), i.push(r);
  }), n;
}
function Bv(t) {
  return Array.isArray(t) ? t : [t];
}
const n_ = /* @__PURE__ */ new Set(["true", "false"]);
function Hv(t) {
  return n_.has(t.toLowerCase());
}
const lr = "__INTERNAL_EDITOR__", Zc = `${lr}DOCS_NORMAL`, qc = `${lr}DOCS_FORMULA_BAR`, r_ = `${lr}ZEN_EDITOR`, s_ = `${lr}COMMENT_EDITOR`, jv = `\r
`, $v = "isRowStylePrecedeColumnStyle", i_ = Symbol("AUTO_HEIGHT_FOR_MERGED_CELLS");
function Wv(t) {
  return `${lr}${t}`;
}
function o_(t) {
  return t.startsWith(lr);
}
function Vv(t) {
  return t.startsWith(s_);
}
function Gv(t, e) {
  e.forEach((n) => t.add(n));
}
function a_(t, e) {
  e.forEach(([n]) => {
    t.has(n) && t.get(n);
  });
}
function l_(t, e) {
  if (Object.is(t, e)) return !0;
  if (typeof t != "object" || !t || typeof e != "object" || !e) return !1;
  let n = Object.keys(t), r = Object.keys(e);
  if (n.length !== r.length) return !1;
  let s = Object.prototype.hasOwnProperty.bind(e);
  for (let i = 0; i < n.length; i++) {
    let o = n[i];
    if (!s(o) || t[o] !== e[o]) return !1;
  }
  return !0;
}
var $i = class extends Error {
  constructor(t) {
    super(t), this.name = "CustomCommandExecutionError";
  }
}, Yv = class extends $i {
  constructor() {
    super("Canceled by facade"), this.name = "CanceledError";
  }
};
function zv(t, e = 16) {
  let n = 0, r = null;
  return function(...s) {
    let i = Date.now();
    i - n < e ? (r && clearTimeout(r), r = setTimeout(() => {
      n = i, t.apply(this, s);
    }, e)) : (n = i, t.apply(this, s));
  };
}
function Br(t) {
  "@babel/helpers - typeof";
  return Br = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Br(t);
}
function u_(t, e) {
  if (Br(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (Br(r) != "object") return r;
    throw TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function c_(t) {
  var e = u_(t, "string");
  return Br(e) == "symbol" ? e : e + "";
}
function y(t, e, n) {
  return (e = c_(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
let ts = function(t) {
  return t[t.Style = 1] = "Style", t[t.Value = 2] = "Value", t;
}({});
function Kv(t) {
  return `sheet_interceptor_${t}`;
}
const d_ = (t) => function(e, n) {
  let r = -1, s = e;
  for (let i = 0; i <= t.length; i++) {
    if (i <= r) throw Error("[SheetInterceptorService]: next() called multiple times!");
    if (r = i, i === t.length) return s;
    let o = t[i], a = !1;
    if (s = o.handler(s, n, (l) => (a = !0, l)), !a) break;
  }
  return s;
};
var Xv = class {
  constructor(t) {
    y(this, "_interceptorsByName", /* @__PURE__ */ new Map()), y(this, "_interceptorPoints", void 0), this._interceptorPoints = t;
  }
  fetchThroughInterceptors(t, e) {
    let n = t, r = this._interceptorsByName.get(n);
    return e && (r = r.filter(e)), d_(r || []);
  }
  intercept(t, e) {
    let n = t;
    this._interceptorsByName.has(n) || this._interceptorsByName.set(n, []);
    let r = this._interceptorsByName.get(n);
    return r.push(e), this._interceptorsByName.set(n, r.sort((s, i) => {
      var o, a;
      return ((o = i.priority) == null ? 0 : o) - ((a = s.priority) == null ? 0 : a);
    })), () => Xs(this._interceptorsByName.get(n), e);
  }
  getInterceptPoints() {
    return this._interceptorPoints;
  }
  dispose() {
    this._interceptorsByName.clear();
  }
};
function Qv(t) {
  return `sheet_async_interceptor_${t}`;
}
const h_ = (t) => async function(e, n) {
  let r = -1, s = e;
  for (let i = 0; i <= t.length; i++) {
    if (i <= r) throw Error("[SheetInterceptorService]: next() called multiple times!");
    if (r = i, i === t.length) return s;
    let o = t[i], a = !1;
    if (s = await o.handler(s, n, async (l) => (a = !0, l)), !a) break;
  }
  return s;
};
var Jv = class {
  constructor(t) {
    y(this, "_asyncInterceptorsByName", /* @__PURE__ */ new Map()), y(this, "_asyncInterceptorPoints", void 0), this._asyncInterceptorPoints = t;
  }
  fetchThroughAsyncInterceptors(t, e) {
    let n = t, r = this._asyncInterceptorsByName.get(n);
    return e && (r = r.filter(e)), h_(r || []);
  }
  async interceptAsync(t, e) {
    let n = t;
    this._asyncInterceptorsByName.has(n) || this._asyncInterceptorsByName.set(n, []);
    let r = this._asyncInterceptorsByName.get(n);
    return r.push(e), this._asyncInterceptorsByName.set(n, r.sort((s, i) => {
      var o, a;
      return ((o = i.priority) == null ? 0 : o) - ((a = s.priority) == null ? 0 : a);
    })), () => Xs(this._asyncInterceptorsByName.get(n), e);
  }
  getInterceptPoints() {
    return this._asyncInterceptorPoints;
  }
  dispose() {
    this._asyncInterceptorsByName.clear();
  }
};
function td(t) {
  return t.map((e) => e / 255);
}
function ed(t) {
  return t.map((e) => Math.round(e * 255));
}
function f_([t, e, n]) {
  let r = Math.max(t, e, n), s = Math.min(t, e, n), i = (r + s) / 2, o = 0, a = 0;
  if (r !== s) {
    let l = r - s;
    switch (a = i > 0.5 ? l / (2 - r - s) : l / (r + s), r) {
      case t:
        o = (e - n) / l + (e < n ? 6 : 0);
        break;
      case e:
        o = (n - t) / l + 2;
        break;
      case n:
        o = (t - e) / l + 4;
        break;
    }
    o /= 6;
  }
  return [o, a, i];
}
function Ms(t, e, n) {
  let r = [t, e, n].map((s) => s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r[0] + 0.7152 * r[1] + 0.0722 * r[2];
}
function Bl(t, e) {
  return (Math.max(t, e) + 0.05) / (Math.min(t, e) + 0.05);
}
function p_(t, e, n) {
  let r, s, i;
  if (e === 0) r = s = i = n;
  else {
    let o = (u, c, d) => {
      let h = d;
      return h < 0 && (h += 1), h > 1 && --h, h < 0.16666666666666666 ? u + (c - u) * 6 * h : h < 0.5 ? c : h < 0.6666666666666666 ? u + (c - u) * (0.6666666666666666 - h) * 6 : u;
    }, a = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - a;
    r = o(l, a, t + 1 / 3), s = o(l, a, t), i = o(l, a, t - 1 / 3);
  }
  return [r, s, i];
}
const Ci = { r: 1, g: 1, b: 1 }, Ri = { r: 0, g: 0, b: 0 }, g_ = Ms(Ci.r, Ci.g, Ci.b), m_ = Ms(Ri.r, Ri.g, Ri.b);
function __(t) {
  let e = Bl(g_, Ms(t[0], t[1], t[2])), n = f_(t), r = 1 - n[2], s, i, o;
  do
    s = p_(n[0], n[1], r), i = Ms(s[0], s[1], s[2]), o = Bl(i, m_), r += 0.01;
  while (r <= 1 && r >= 0 && Math.abs(o - e) < 0.01);
  return s;
}
function Zv(t) {
  return ed(__(td(t)));
}
const Se = [[0.333, -0.667, -0.667, 0, 1], [-0.667, 0.333, -0.667, 0, 1], [-0.667, -0.667, 0.333, 0, 1], [0, 0, 0, 1, 0]];
function y_(t) {
  let e = t[0], n = t[1], r = t[2], s = [Se[0][0] * e + Se[0][1] * n + Se[0][2] * r + Se[0][4], Se[1][0] * e + Se[1][1] * n + Se[1][2] * r + Se[1][4], Se[2][0] * e + Se[2][1] * n + Se[2][2] * r + Se[2][4]];
  return s = s.map((i) => i > 1 ? 1 : i < 0 ? 0 : i), s;
}
function qv(t) {
  return ed(y_(td(t)));
}
var ur = class {
  constructor() {
    y(this, "cursor", 0);
  }
  reset() {
    return this.cursor = 0, this;
  }
  moveCursor(t) {
    this.cursor += t;
  }
  moveCursorTo(t) {
    this.cursor = t;
  }
};
function tC(t, e) {
  for (let n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
}
function E_(t) {
  return /^-?\d+(\.\d+)?$/.test(t);
}
function eC(t) {
  return E_(t) ? Number(t) <= 2 ** 53 - 1 : !1;
}
function nC(t) {
  return Number(t) > 2 ** 53 - 1 || t.length >= 18;
}
var rC = class nd {
  constructor() {
    y(this, "_data", []);
  }
  static create() {
    return new nd();
  }
  add(e) {
    this._data.indexOf(e) > -1 || this._data.push(e);
  }
  delete(e) {
    let n = this._data.indexOf(e);
    this._data.splice(n, 1);
  }
  getData() {
    return this._data;
  }
}, sC = class rd {
  constructor() {
    y(this, "_data", /* @__PURE__ */ new Map());
  }
  static create() {
    return new rd();
  }
  add(e, n) {
    this._data.has(e) || this._data.set(e, n);
  }
  delete(e) {
    this._data.delete(e);
  }
  getData() {
    return this._data;
  }
};
function iC(t) {
  let e = new MessageChannel(), n = !1, r = () => {
    n || t();
  };
  return e.port1.onmessage = r, e.port2.postMessage(null), () => {
    n = !0, e.port1.onmessage = null, e.port1.close(), e.port2.close();
  };
}
async function v_(t) {
  for (let [e, n] of t.entries()) try {
    if (!await n()) return { index: e, result: !1 };
  } catch (r) {
    return { index: e, result: !1, error: r };
  }
  return { result: !0, index: -1 };
}
function C_(t) {
  for (let [e, n] of t.entries()) try {
    if (!n()) return { index: e, result: !1 };
  } catch (r) {
    return { index: e, result: !1, error: r };
  }
  return { result: !0, index: -1 };
}
function oC(t, e) {
  return e.forEach((n) => t.add(n)), t;
}
function R_(t) {
  return t instanceof sr || t instanceof ae || t && "closed" in t && t.unsubscribe !== void 0;
}
function Gt(t) {
  let e = !1;
  return t ? R_(t) ? { dispose: () => t.unsubscribe() } : typeof t == "function" ? { dispose: () => {
    e || (e = !0, t());
  } } : t : Gt(() => {
  });
}
var Ra = class {
  constructor() {
    y(this, "_disposables", /* @__PURE__ */ new Set());
  }
  add(t) {
    let e = Gt(t);
    return this._disposables.add(e), { dispose: (n = !1) => {
      n || e.dispose(), this._disposables.delete(e);
    } };
  }
  dispose() {
    this._disposables.forEach((t) => {
      t.dispose();
    }), this._disposables.clear();
  }
}, Qt = class {
  constructor() {
    y(this, "_disposed", !1), y(this, "_collection", new Ra());
  }
  disposeWithMe(t) {
    return this._collection.add(t);
  }
  ensureNotDisposed() {
    if (this._disposed) throw Error("[Disposable]: object is disposed!");
  }
  dispose() {
    this._disposed || (this._disposed = !0, this._collection.dispose());
  }
}, aC = class extends Qt {
  constructor(...t) {
    super(...t), y(this, "dispose$", new ae());
  }
  dispose() {
    super.dispose(), this.dispose$.next(), this.dispose$.complete();
  }
}, lC = class extends Qt {
  constructor(t) {
    super(), this._rootDisposable = t, y(this, "_ref", 0);
  }
  inc() {
    if (this._disposed) throw Error("[RCDisposable]: should not ref to a disposed.");
    this._ref += 1;
  }
  dec() {
    --this._ref, this._ref === 0 && (this._rootDisposable.dispose(), this.dispose());
  }
}, ba = class extends Qt {
};
const sd = new Set("ac.ad.ae.aero.af.ag.ai.al.am.ao.aq.ar.arpa.as.asia.at.au.aw.ax.az.ba.bb.bd.be.bf.bg.bh.bi.biz.bj.bm.bn.bo.br.bs.bt.bv.bw.by.bz.ca.cat.cc.cd.cf.cg.ch.ci.ck.cl.cm.cn.co.com.coop.cr.cu.cv.cw.cx.cy.cz.de.dj.dk.dm.do.dz.ec.edu.ee.eg.er.es.et.eu.fi.fj.fk.fm.fo.fr.ga.gb.gd.ge.gf.gg.gh.gi.gl.gm.gn.gov.gp.gq.gr.gs.gt.gu.gw.gy.hk.hm.hn.hr.ht.hu.id.ie.il.im.in.info.int.io.iq.ir.is.it.je.jm.jo.jobs.jp.ke.kg.kh.ki.km.kn.kp.kr.kw.ky.kz.la.lb.lc.li.lk.lr.ls.lt.lu.lv.ly.ma.mc.md.me.mg.mh.mil.mk.ml.mm.mn.mo.mobi.mp.mq.mr.ms.mt.mu.museum.mv.mw.mx.my.mz.na.name.nc.ne.net.nf.ng.ni.nl.no.np.nr.nu.nz.om.onion.org.pa.pe.pf.pg.ph.pk.pl.pm.pn.post.pr.pro.ps.pt.pw.py.qa.re.ro.rs.ru.rw.sa.sb.sc.sd.se.sg.sh.si.sj.sk.sl.sm.sn.so.sr.ss.st.su.sv.sx.sy.sz.tc.td.tel.tf.tg.th.tj.tk.tl.tm.tn.to.tr.tt.tv.tw.tz.ua.ug.uk.us.uy.uz.va.vc.ve.vg.vi.vn.vu.wf.ws.yt.za.zm.zw".split(".")), b_ = RegExp("^(?:(?:(?:https?|ftp):)?\\/\\/)?(?:\\S+(?::\\S*)?@)?(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\\u00a1-\\uffff][a-z0-9\\u00a1-\\uffff_-]{0,62})?[a-z0-9\\u00a1-\\uffff]\\.)+(?:[a-z\\u00a1-\\uffff]{2,}\\.?))(?::\\d{2,5})?(?:[/?#]\\S*)?$", "i");
function I_(t) {
  if (!Number.isNaN(+t)) return !1;
  if (t.startsWith("http://localhost:3002") || t.startsWith("localhost:3002")) return !0;
  if (b_.test(t)) {
    if (id(t)) return !0;
    try {
      let e = new URL(od(t)).hostname.split(".").pop();
      if (e && sd.has(e)) return !0;
    } catch {
      return !1;
    }
  }
  return !1;
}
function id(t) {
  return /^[a-zA-Z]+:\/\//.test(t);
}
function T_(t) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(t);
}
function od(t) {
  return id(t) ? t : T_(t) ? `mailto://${t}` : `https://${t}`;
}
function uC(t, e) {
  try {
    let n = new URL(e), r = n.pathname.endsWith("/") ? n.pathname : `${n.pathname}/`, s = t.startsWith("/") ? t.substring(1) : t;
    return new URL(s, n.origin + r).toString();
  } catch (n) {
    return console.error("Error resolving URL with base URL:", n), t;
  }
}
function Ia(t, e) {
  return j.getValueType(t) === j.getValueType(e) ? j.isArray(t) ? S_(t, e) : j.isObject(t) ? w_(t, e) : j.isDate(t) ? t.getTime() === e.getTime() : j.isRegExp(t) ? t.toString() === e.toString() : t === e : !1;
}
function S_(t, e) {
  if (t.length !== e.length) return !1;
  for (let n = 0, r = t.length; n < r; n++) {
    let s = t[n], i = e[n];
    if (!Ia(s, i)) return !1;
  }
  return !0;
}
function w_(t, e) {
  let n = Object.keys(t), r = Object.keys(e);
  if (n.length !== r.length) return !1;
  for (let s of n) {
    if (!r.includes(s)) return !1;
    let i = t[s], o = e[s];
    if (!Ia(i, o)) return !1;
  }
  return !0;
}
var j = class Ye {
  static deleteNull(e) {
    for (let n in e) (e[n] === null || e[n] === void 0) && delete e[n];
    return e;
  }
  static getSystemType() {
    let e = navigator.userAgent, n = navigator.platform === "Win32" || navigator.platform === "Windows", r = navigator.platform === "Mac68K" || navigator.platform === "MacPPC" || navigator.platform === "Macintosh" || navigator.platform === "MacIntel";
    if (r) return "Mac";
    if (navigator.platform === "X11" && !n && !r) return "Unix";
    if (String(navigator.platform).indexOf("Linux") > -1) return "Linux";
    if (n) {
      if (e.indexOf("Windows NT 5.0") > -1 || e.indexOf("Windows 2000") > -1) return "Windows 2000";
      if (e.indexOf("Windows NT 5.1") > -1 || e.indexOf("Windows XP") > -1) return "Windows XP";
      if (e.indexOf("Windows NT 5.2") > -1 || e.indexOf("Windows 2003") > -1) return "Windows 2003";
      if (e.indexOf("Windows NT 6.0") > -1 || e.indexOf("Windows Vista") > -1) return "Windows Vista";
      if (e.indexOf("Windows NT 6.1") > -1 || e.indexOf("Windows 7") > -1) return "Windows 7";
      if (e.indexOf("Windows NT 10") > -1 || e.indexOf("Windows 10") > -1) return "Windows 10";
      if (e.indexOf("Windows NT 11") > -1 || e.indexOf("Windows 11") > -1) return "Windows 11";
    }
    return "Unknown system";
  }
  static getBrowserType() {
    let e = navigator.userAgent, n = e.indexOf("Opera") > -1, r = e.indexOf("compatible") > -1 && e.indexOf("MSIE") > -1 && !n, s = e.indexOf("Trident") > -1 && e.indexOf("rv:11.0") > -1, i = e.indexOf("Edge") > -1, o = e.indexOf("Firefox") > -1, a = e.indexOf("Safari") > -1 && e.indexOf("Chrome") === -1, l = e.indexOf("Chrome") > -1 && e.indexOf("Safari") > -1;
    if (r) {
      RegExp("MSIE (\\d+\\.\\d+);").test(e);
      let u = Number.parseFloat(RegExp.$1);
      return u === 7 ? "IE7" : u === 8 ? "IE8" : u === 9 ? "IE9" : u === 10 ? "IE10" : "0";
    }
    return o ? "FF" : n ? "Opera" : a ? "Safari" : l ? "Chrome" : i ? "Edge" : s ? "IE11" : "Unknown browser";
  }
  static deepMerge(e, ...n) {
    n.forEach((o) => o && i(o));
    function r(o, a) {
      o.forEach((l, u) => {
        if (Ye.isArray(l)) {
          var c;
          let h = (c = a[u]) == null ? [] : c;
          a[u] = h, r(l, h);
          return;
        }
        if (Ye.isObject(l)) {
          var d;
          let h = (d = a[u]) == null ? {} : d;
          a[u] = h, s(l, h);
          return;
        }
        a[u] = l;
      });
    }
    function s(o, a) {
      Object.keys(o).forEach((l) => {
        let u = o[l];
        if (Ye.isObject(u)) {
          var c;
          let h = (c = a[l]) == null ? {} : c;
          a[l] = h, s(u, h);
          return;
        }
        if (Ye.isArray(u)) {
          var d;
          let h = (d = a[l]) == null ? [] : d;
          a[l] = h, r(u, h);
          return;
        }
        a[l] = u;
      });
    }
    function i(o) {
      Object.keys(o).forEach((a) => {
        let l = o[a];
        if (Ye.isArray(l)) {
          var u;
          let d = (u = e[a]) == null ? [] : u;
          e[a] = d, r(l, d);
          return;
        }
        if (Ye.isObject(l)) {
          var c;
          let d = (c = e[a]) == null ? {} : c;
          e[a] = d, s(l, d);
          return;
        }
        e[a] = l;
      });
    }
    return e;
  }
  static diffValue(e, n) {
    return Ia(e, n);
  }
  static deepClone(e) {
    if (!this.isDefine(e)) return e;
    if (this.isRegExp(e)) return new RegExp(e);
    if (this.isDate(e)) return new Date(e);
    if (this.isArray(e)) {
      let n = [];
      return e.forEach((r, s) => {
        n[s] = Ye.deepClone(r);
      }), n;
    }
    if (this.isObject(e)) {
      let n = {};
      return Object.keys(e).forEach((r) => {
        let s = e[r];
        n[r] = Ye.deepClone(s);
      }), Object.setPrototypeOf(n, Object.getPrototypeOf(e)), n;
    }
    return e;
  }
  static getValueType(e) {
    return Object.prototype.toString.apply(e);
  }
  static isDefine(e) {
    return e != null;
  }
  static isBlank(e) {
    return this.isDefine(e) ? this.isString(e) ? e.trim() === "" : !1 : !0;
  }
  static isPlainObject(e) {
    return this.isDefine(e) ? Object.getPrototypeOf(e) === Object.getPrototypeOf({}) : !1;
  }
  static isDate(e) {
    return this.getValueType(e) === "[object Date]";
  }
  static isRegExp(e) {
    return this.getValueType(e) === "[object RegExp]";
  }
  static isArray(e) {
    return this.getValueType(e) === "[object Array]";
  }
  static isString(e) {
    return this.getValueType(e) === "[object String]";
  }
  static isNumber(e) {
    return this.getValueType(e) === "[object Number]";
  }
  static isStringNumber(e) {
    return !isNaN(Number.parseFloat(e)) && isFinite(e);
  }
  static isObject(e) {
    return this.getValueType(e) === "[object Object]";
  }
  static isEmptyObject(e) {
    for (let n in e) return !1;
    return !0;
  }
  static isTablet() {
    return /ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase());
  }
  static isIPhone() {
    return /iPhone/i.test(navigator.userAgent);
  }
  static isLegalUrl(e) {
    return I_(e);
  }
  static normalizeUrl(e) {
    return od(e);
  }
  static topLevelDomainCombiningString() {
    return [...sd].join("|");
  }
  static removeNull(e) {
    return this.isObject(e) && Object.keys(e).forEach((n) => {
      let r = e[n];
      r == null ? delete e[n] : Ye.removeNull(r);
    }), e;
  }
  static numToWord(e) {
    let n = "";
    for (; e > 0; ) {
      let r = e % 26;
      r = r === 0 ? r = 26 : r, n = String.fromCharCode(96 + r) + n, e = (e - r) / 26;
    }
    return n.toLocaleUpperCase();
  }
  static ABCatNum(e) {
    if (e == null || e.length === 0) return NaN;
    let n = e.toLowerCase().split(""), r = n.length, s = 0, i = 0;
    for (let o = 0; o < r; o++) i = n[o].charCodeAt(0) - 96, s += i * 26 ** (r - o - 1);
    return s === 0 ? NaN : s - 1;
  }
  static chatAtABC(e) {
    let n = "";
    for (; e >= 0; ) n = String.fromCharCode(e % 26 + 97) + n, e = Math.floor(e / 26) - 1;
    return n.toUpperCase();
  }
  static commonExtend(e, n) {
    let r = {};
    for (let s in e) r[s] = e[s];
    for (let s in n) n[s] != null && (r[s] = n[s]);
    return r;
  }
  static hasIntersectionBetweenTwoRanges(e, n, r, s) {
    return n >= r && s >= e;
  }
  static isStartValidPosition(e) {
    return /^[A-Za-zА-Яа-яЁё_]/.test(e);
  }
  static isValidParameter(e) {
    let n = /[~!@#$%^&*()+=\-{}\[\]\|:;"'<>,?\/ ]+/.test(e), r = e.length <= 255;
    return !n && r;
  }
  static clamp(e, n, r) {
    return Math.max(n, Math.min(r, e));
  }
  static now() {
    return performance && performance.now ? performance.now() : Date.now();
  }
};
function ce(t = 21, e) {
  return e ? Cm(e, t)() : Rm(t);
}
function es(...t) {
  let e = {}, n = t.length;
  for (let r = n - 1; r >= 0; r--) {
    let s = t[r];
    if (s) {
      let i = Object.keys(s);
      for (let o of i) e[o] === void 0 && (e[o] = s[o]);
    }
  }
  return e;
}
const cC = () => typeof process < "u" && process.versions != null && process.versions.node != null;
function dC(t) {
  let e = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*").replace(/\\\?/g, ".");
  return RegExp(`^${e}$`, "i");
}
let hC = function(t) {
  return t[t.DEFAULT_SERIES = 0] = "DEFAULT_SERIES", t[t.ALTERNATE_SERIES = 1] = "ALTERNATE_SERIES", t;
}({}), Ft = function(t) {
  return t[t.NONE = 0] = "NONE", t[t.THIN = 1] = "THIN", t[t.HAIR = 2] = "HAIR", t[t.DOTTED = 3] = "DOTTED", t[t.DASHED = 4] = "DASHED", t[t.DASH_DOT = 5] = "DASH_DOT", t[t.DASH_DOT_DOT = 6] = "DASH_DOT_DOT", t[t.DOUBLE = 7] = "DOUBLE", t[t.MEDIUM = 8] = "MEDIUM", t[t.MEDIUM_DASHED = 9] = "MEDIUM_DASHED", t[t.MEDIUM_DASH_DOT = 10] = "MEDIUM_DASH_DOT", t[t.MEDIUM_DASH_DOT_DOT = 11] = "MEDIUM_DASH_DOT_DOT", t[t.SLANT_DASH_DOT = 12] = "SLANT_DASH_DOT", t[t.THICK = 13] = "THICK", t;
}({}), fC = function(t) {
  return t.TOP = "top", t.BOTTOM = "bottom", t.LEFT = "left", t.RIGHT = "right", t.NONE = "none", t.ALL = "all", t.OUTSIDE = "outside", t.INSIDE = "inside", t.HORIZONTAL = "horizontal", t.VERTICAL = "vertical", t.TLBR = "tlbr", t.TLBC_TLMR = "tlbc_tlmr", t.TLBR_TLBC_TLMR = "tlbr_tlbc_tlmr", t.BLTR = "bl_tr", t.MLTR_BCTR = "mltr_bctr", t;
}({}), pC = function(t) {
  return t[t.UNSUPPORTED = 0] = "UNSUPPORTED", t[t.RGB = 1] = "RGB", t[t.HEX = 2] = "HEX", t[t.THEME = 3] = "THEME", t;
}({}), gC = function(t) {
  return t[t.ON = 0] = "ON", t[t.OFF = 1] = "OFF", t;
}({}), mC = function(t) {
  return t[t.PASTE_NORMAL = 0] = "PASTE_NORMAL", t[t.PASTE_NO_BORDERS = 1] = "PASTE_NO_BORDERS", t[t.PASTE_FORMAT = 2] = "PASTE_FORMAT", t[t.PASTE_FORMULA = 3] = "PASTE_FORMULA", t[t.PASTE_DATA_VALIDATION = 4] = "PASTE_DATA_VALIDATION", t[t.PASTE_VALUES = 5] = "PASTE_VALUES", t[t.PASTE_CONDITIONAL_FORMATTING = 6] = "PASTE_CONDITIONAL_FORMATTING", t[t.PASTE_COLUMN_WIDTHS = 7] = "PASTE_COLUMN_WIDTHS", t;
}({}), _C = function(t) {
  return t[t.LEFT = 0] = "LEFT", t[t.RIGHT = 1] = "RIGHT", t;
}({}), yC = function(t) {
  return t[t.DOCUMENT = 0] = "DOCUMENT", t[t.PROJECT = 1] = "PROJECT", t;
}({}), EC = function(t) {
  return t[t.COLUMNS = 0] = "COLUMNS", t[t.ROWS = 1] = "ROWS", t;
}({}), fn = function(t) {
  return t[t.UP = 0] = "UP", t[t.RIGHT = 1] = "RIGHT", t[t.DOWN = 2] = "DOWN", t[t.LEFT = 3] = "LEFT", t;
}({});
function vC(t) {
  switch (t) {
    case fn.LEFT:
      return fn.RIGHT;
    case fn.RIGHT:
      return fn.LEFT;
    case fn.UP:
      return fn.DOWN;
    case fn.DOWN:
      return fn.UP;
  }
}
let CC = function(t) {
  return t[t.INTERPOLATION_POINT_TYPE_UNSPECIFIED = 0] = "INTERPOLATION_POINT_TYPE_UNSPECIFIED", t[t.MIN = 1] = "MIN", t[t.MAX = 2] = "MAX", t[t.NUMBER = 3] = "NUMBER", t[t.PERCENT = 4] = "PERCENT", t[t.PERCENTILE = 5] = "PERCENTILE", t;
}({}), Ta = function(t) {
  return t.EN_US = "enUS", t.FR_FR = "frFR", t.ZH_CN = "zhCN", t.RU_RU = "ruRU", t.ZH_TW = "zhTW", t.VI_VN = "viVN", t.FA_IR = "faIR", t.JA_JP = "jaJP", t.KO_KR = "koKR", t.ES_ES = "esES", t.CA_ES = "caES", t.SK_SK = "skSK", t;
}({}), Hl = function(t) {
  return t[t.PERSON = 0] = "PERSON", t[t.FILE = 1] = "FILE", t[t.DATE = 2] = "DATE", t[t.LOCATION = 3] = "LOCATION", t[t.EVENT = 4] = "EVENT", t;
}({}), RC = function(t) {
  return t[t.RANGE = 0] = "RANGE", t[t.SHEET = 1] = "SHEET", t;
}({}), bC = function(t) {
  return t.Line = "line", t.LineInv = "lineInv", t.Triangle = "triangle", t.RtTriangle = "rtTriangle", t.Rect = "rect", t.Diamond = "diamond", t.Parallelogram = "parallelogram", t.Trapezoid = "trapezoid", t.NonIsocelesTrapezoid = "nonIsocelesTrapezoid", t.Pentagon = "pentagon", t.Hexagon = "hexagon", t.Heptagon = "heptagon", t.Octagon = "octagon", t.Decagon = "decagon", t.Dodecagon = "dodecagon", t.Star4 = "star4", t.Star5 = "star5", t.Star6 = "star6", t.Star7 = "star7", t.Star8 = "star8", t.Star10 = "star10", t.Star12 = "star12", t.Star16 = "star16", t.Star24 = "star24", t.Star32 = "star32", t.RoundRect = "roundRect", t.Round1Rect = "round1Rect", t.Round2SameRect = "round2SameRect", t.Round2DiagRect = "round2DiagRect", t.Ellipse = "ellipse", t;
}({}), IC = function(t) {
  return t.RightArrow = "rightArrow", t.LeftArrow = "leftArrow", t.UpArrow = "upArrow", t.DownArrow = "downArrow", t.LeftRightArrow = "leftRightArrow", t.UpDownArrow = "upDownArrow", t.QuadArrow = "quadArrow", t.LeftRightUpArrow = "leftRightUpArrow", t.BentArrow = "bentArrow", t.UturnArrow = "uturnArrow", t.CircularArrow = "circularArrow", t.NotchedRightArrow = "notchedRightArrow", t.HomePlate = "homePlate", t.Chevron = "chevron", t.LeftCircularArrow = "leftCircularArrow", t.LeftRightCircularArrow = "leftRightCircularArrow", t;
}({}), TC = function(t) {
  return t.Plaque = "plaque", t.Can = "can", t.Cube = "cube", t.Bevel = "bevel", t.Donut = "donut", t.NoSmoking = "noSmoking", t.BlockArc = "blockArc", t.FoldedCorner = "foldedCorner", t;
}({}), SC = function(t) {
  return t.SmileyFace = "smileyFace", t.Heart = "heart", t.LightningBolt = "lightningBolt", t.Sun = "sun", t.Moon = "moon", t.Cloud = "cloud", t.Arc = "arc", t.Backpack = "backpack", t.Frame = "frame", t.HalfFrame = "halfFrame", t.Corner = "corner", t.Chord = "chord", t.Pie = "pie", t.Teardrop = "teardrop", t.WedgeRectCallout = "wedgeRectCallout", t.WedgeRRectCallout = "wedgeRRectCallout", t.WedgeEllipseCallout = "wedgeEllipseCallout", t.CloudCallout = "cloudCallout", t.BorderCallout1 = "borderCallout1", t.BorderCallout2 = "borderCallout2", t.BorderCallout3 = "borderCallout3", t.AccentCallout1 = "accentCallout1", t.AccentCallout2 = "accentCallout2", t.AccentCallout3 = "accentCallout3", t.Callout1 = "callout1", t.Callout2 = "callout2", t.Callout3 = "callout3", t.ActionButtonBackPrevious = "actionButtonBackPrevious", t.ActionButtonEnd = "actionButtonEnd", t.ActionButtonForwardNext = "actionButtonForwardNext", t.ActionButtonHelp = "actionButtonHelp", t.ActionButtonHome = "actionButtonHome", t.ActionButtonInformation = "actionButtonInformation", t.ActionButtonMovie = "actionButtonMovie", t.ActionButtonReturn = "actionButtonReturn", t.ActionButtonSound = "actionButtonSound", t;
}({}), wC = function(t) {
  return t[t.RELATIVE_DATE_UNSPECIFIED = 0] = "RELATIVE_DATE_UNSPECIFIED", t[t.PAST_YEAR = 1] = "PAST_YEAR", t[t.PAST_MONTH = 2] = "PAST_MONTH", t[t.PAST_WEEK = 3] = "PAST_WEEK", t[t.YESTERDAY = 4] = "YESTERDAY", t[t.TODAY = 5] = "TODAY", t[t.TOMORROW = 6] = "TOMORROW", t;
}({}), OC = function(t) {
  return t[t.GRID = 0] = "GRID", t[t.KANBAN = 1] = "KANBAN", t[t.GANTT = 2] = "GANTT", t;
}({}), Wi = function(t) {
  return t[t.UNSPECIFIED = 0] = "UNSPECIFIED", t[t.LEFT_TO_RIGHT = 1] = "LEFT_TO_RIGHT", t[t.RIGHT_TO_LEFT = 2] = "RIGHT_TO_LEFT", t;
}({}), AC = function(t) {
  return t[t.DASH = 0] = "DASH", t[t.DASH_DOT_DOT_HEAVY = 1] = "DASH_DOT_DOT_HEAVY", t[t.DASH_DOT_HEAVY = 2] = "DASH_DOT_HEAVY", t[t.DASHED_HEAVY = 3] = "DASHED_HEAVY", t[t.DASH_LONG = 4] = "DASH_LONG", t[t.DASH_LONG_HEAVY = 5] = "DASH_LONG_HEAVY", t[t.DOT_DASH = 6] = "DOT_DASH", t[t.DOT_DOT_DASH = 7] = "DOT_DOT_DASH", t[t.DOTTED = 8] = "DOTTED", t[t.DOTTED_HEAVY = 9] = "DOTTED_HEAVY", t[t.DOUBLE = 10] = "DOUBLE", t[t.NONE = 11] = "NONE", t[t.SINGLE = 12] = "SINGLE", t[t.THICK = 13] = "THICK", t[t.WAVE = 14] = "WAVE", t[t.WAVY_DOUBLE = 15] = "WAVY_DOUBLE", t[t.WAVY_HEAVY = 16] = "WAVY_HEAVY", t[t.WORDS = 17] = "WORDS", t;
}({}), sn = function(t) {
  return t[t.UNSPECIFIED = 0] = "UNSPECIFIED", t[t.LEFT = 1] = "LEFT", t[t.CENTER = 2] = "CENTER", t[t.RIGHT = 3] = "RIGHT", t[t.JUSTIFIED = 4] = "JUSTIFIED", t[t.BOTH = 5] = "BOTH", t[t.DISTRIBUTED = 6] = "DISTRIBUTED", t;
}({}), Nr = function(t) {
  return t[t.UNSPECIFIED = 0] = "UNSPECIFIED", t[t.TOP = 1] = "TOP", t[t.MIDDLE = 2] = "MIDDLE", t[t.BOTTOM = 3] = "BOTTOM", t;
}({}), Hr = function(t) {
  return t[t.UNSPECIFIED = 0] = "UNSPECIFIED", t[t.OVERFLOW = 1] = "OVERFLOW", t[t.CLIP = 2] = "CLIP", t[t.WRAP = 3] = "WRAP", t;
}({}), jl = function(t) {
  return t[t.NORMAL = 0] = "NORMAL", t[t.ITALIC = 1] = "ITALIC", t;
}({}), $l = function(t) {
  return t[t.NORMAL = 0] = "NORMAL", t[t.BOLD = 1] = "BOLD", t;
}({}), Dr = function(t) {
  return t[t.NORMAL = 1] = "NORMAL", t[t.SUBSCRIPT = 2] = "SUBSCRIPT", t[t.SUPERSCRIPT = 3] = "SUPERSCRIPT", t;
}({}), z = function(t) {
  return t[t.FALSE = 0] = "FALSE", t[t.TRUE = 1] = "TRUE", t;
}({}), Xn = function(t) {
  return t[t.STRING = 1] = "STRING", t[t.NUMBER = 2] = "NUMBER", t[t.BOOLEAN = 3] = "BOOLEAN", t[t.FORCE_STRING = 4] = "FORCE_STRING", t;
}({}), we = function(t) {
  return t[t.DARK1 = 0] = "DARK1", t[t.LIGHT1 = 1] = "LIGHT1", t[t.DARK2 = 2] = "DARK2", t[t.LIGHT2 = 3] = "LIGHT2", t[t.ACCENT1 = 4] = "ACCENT1", t[t.ACCENT2 = 5] = "ACCENT2", t[t.ACCENT3 = 6] = "ACCENT3", t[t.ACCENT4 = 7] = "ACCENT4", t[t.ACCENT5 = 8] = "ACCENT5", t[t.ACCENT6 = 9] = "ACCENT6", t[t.HYPERLINK = 10] = "HYPERLINK", t[t.FOLLOWED_HYPERLINK = 11] = "FOLLOWED_HYPERLINK", t;
}({}), ad = function(t) {
  return t.OFFICE = "Office", t.OFFICE_2007_2010 = "Office 2007-2010", t.GRAYSCALE = "Grayscale", t.BLUE_WARM = "Blue Warm", t.BLUE = "Blue", t.BLUE_II = "Blue II", t.BLUE_GREEN = "Blue Green", t.GREEN = "Green", t.GREEN_YELLOW = "Green Yellow", t.YELLOW = "Yellow", t.YELLOW_ORANGE = "Yellow Orange", t.ORANGE = "Orange", t.ORANGE_RED = "Orange Red", t.RED_ORANGE = "Red Orange", t.RED = "Red", t.RED_VIOLET = "Red Violet", t.VIOLET = "Violet", t.VIOLET_II = "Violet II", t.MEDIAN = "Median", t.PAPER = "Paper", t.MARQUEE = "Marquee", t.SLIPSTREAM = "Slipstream", t.Aspect = "Aspect", t;
}({}), NC = function(t) {
  return t[t.character = 0] = "character", t[t.paragraph = 1] = "paragraph", t[t.table = 2] = "table", t[t.numbering = 3] = "numbering", t;
}({}), DC = function(t) {
  return t[t.TAB = 0] = "TAB", t[t.SPACE = 1] = "SPACE", t[t.NOTHING = 2] = "NOTHING", t;
}({}), nt = function(t) {
  return t[t.BULLET = 0] = "BULLET", t[t.NONE = 1] = "NONE", t[t.DECIMAL = 2] = "DECIMAL", t[t.DECIMAL_ZERO = 3] = "DECIMAL_ZERO", t[t.UPPER_LETTER = 4] = "UPPER_LETTER", t[t.LOWER_LETTER = 5] = "LOWER_LETTER", t[t.UPPER_ROMAN = 6] = "UPPER_ROMAN", t[t.LOWER_ROMAN = 7] = "LOWER_ROMAN", t[t.ORDINAL = 8] = "ORDINAL", t[t.CARDINAL_TEXT = 9] = "CARDINAL_TEXT", t[t.ORDINAL_TEXT = 10] = "ORDINAL_TEXT", t[t.HEX = 11] = "HEX", t[t.CHICAGO = 12] = "CHICAGO", t[t.IDEOGRAPH_DIGITAL = 13] = "IDEOGRAPH_DIGITAL", t[t.JAPANESE_COUNTING = 14] = "JAPANESE_COUNTING", t[t.AIUEO = 15] = "AIUEO", t[t.IROHA = 16] = "IROHA", t[t.DECIMAL_FULL_WIDTH = 17] = "DECIMAL_FULL_WIDTH", t[t.DECIMAL_HALF_WIDTH = 18] = "DECIMAL_HALF_WIDTH", t[t.JAPANESE_LEGAL = 19] = "JAPANESE_LEGAL", t[t.JAPANESE_DIGITAL_TEN_THOUSAND = 20] = "JAPANESE_DIGITAL_TEN_THOUSAND", t[t.DECIMAL_ENCLOSED_CIRCLE = 21] = "DECIMAL_ENCLOSED_CIRCLE", t[t.DECIMAL_FULL_WIDTH2 = 22] = "DECIMAL_FULL_WIDTH2", t[t.AIUEO_FULL_WIDTH = 23] = "AIUEO_FULL_WIDTH", t[t.IROHA_FULL_WIDTH = 24] = "IROHA_FULL_WIDTH", t[t.GANADA = 25] = "GANADA", t[t.CHOSUNG = 26] = "CHOSUNG", t[t.DECIMAL_ENCLOSED_FULLSTOP = 27] = "DECIMAL_ENCLOSED_FULLSTOP", t[t.DECIMAL_ENCLOSED_PAREN = 28] = "DECIMAL_ENCLOSED_PAREN", t[t.DECIMAL_ENCLOSED_CIRCLE_CHINESE = 29] = "DECIMAL_ENCLOSED_CIRCLE_CHINESE", t[t.IDEOGRAPH_ENCLOSED_CIRCLE = 30] = "IDEOGRAPH_ENCLOSED_CIRCLE", t[t.IDEOGRAPH_TRADITIONAL = 31] = "IDEOGRAPH_TRADITIONAL", t[t.IDEOGRAPH_ZODIAC = 32] = "IDEOGRAPH_ZODIAC", t[t.IDEOGRAPH_ZODIAC_TRADITIONAL = 33] = "IDEOGRAPH_ZODIAC_TRADITIONAL", t[t.TAIWANESE_COUNTING = 34] = "TAIWANESE_COUNTING", t[t.IDEOGRAPH_LEGAL_TRADITIONAL = 35] = "IDEOGRAPH_LEGAL_TRADITIONAL", t[t.TAIWANESE_COUNTING_THOUSAND = 36] = "TAIWANESE_COUNTING_THOUSAND", t[t.TAIWANESE_DIGITAL = 37] = "TAIWANESE_DIGITAL", t[t.CHINESE_COUNTING = 38] = "CHINESE_COUNTING", t[t.CHINESE_LEGAL_SIMPLIFIED = 39] = "CHINESE_LEGAL_SIMPLIFIED", t[t.CHINESE_COUNTING_THOUSAND = 40] = "CHINESE_COUNTING_THOUSAND", t[t.KOREAN_DIGITAL = 41] = "KOREAN_DIGITAL", t[t.KOREAN_COUNTING = 42] = "KOREAN_COUNTING", t[t.KOREAN_LEGAL = 43] = "KOREAN_LEGAL", t[t.KOREAN_DIGITAL2 = 44] = "KOREAN_DIGITAL2", t[t.VIETNAMESE_COUNTING = 45] = "VIETNAMESE_COUNTING", t[t.RUSSIAN_LOWER = 46] = "RUSSIAN_LOWER", t[t.RUSSIAN_UPPER = 47] = "RUSSIAN_UPPER", t[t.NUMBER_IN_DASH = 48] = "NUMBER_IN_DASH", t[t.HEBREW1 = 49] = "HEBREW1", t[t.HEBREW2 = 50] = "HEBREW2", t[t.ARABIC_ALPHA = 51] = "ARABIC_ALPHA", t[t.ARABIC_ABJAD = 52] = "ARABIC_ABJAD", t[t.HINDI_VOWELS = 53] = "HINDI_VOWELS", t[t.HINDI_CONSONANTS = 54] = "HINDI_CONSONANTS", t[t.HINDI_NUMBERS = 55] = "HINDI_NUMBERS", t[t.HINDI_COUNTING = 56] = "HINDI_COUNTING", t[t.THAI_LETTERS = 57] = "THAI_LETTERS", t[t.THAI_NUMBERS = 58] = "THAI_NUMBERS", t[t.THAI_COUNTING = 59] = "THAI_COUNTING", t[t.CUSTOM = 60] = "CUSTOM", t;
}({}), Sa = function(t) {
  return t[t.BULLET_ALIGNMENT_UNSPECIFIED = 0] = "BULLET_ALIGNMENT_UNSPECIFIED", t[t.START = 1] = "START", t[t.CENTER = 2] = "CENTER", t[t.END = 3] = "END", t[t.BOTH = 4] = "BOTH", t;
}({}), qn = function(t) {
  return t[t.HYPERLINK = 0] = "HYPERLINK", t[t.FIELD = 1] = "FIELD", t[t.SDT = 2] = "SDT", t[t.BOOKMARK = 3] = "BOOKMARK", t[t.COMMENT = 4] = "COMMENT", t[t.CUSTOM = 5] = "CUSTOM", t[t.MENTION = 6] = "MENTION", t[t.UNI_FORMULA = 7] = "UNI_FORMULA", t[t.DELTED = 9999] = "DELTED", t;
}({}), Mr = function(t) {
  return t[t.COMMENT = 0] = "COMMENT", t[t.DELETED = 9999] = "DELETED", t;
}({}), MC = function(t) {
  return t[t.DRAWING = 0] = "DRAWING", t[t.CUSTOM = 1] = "CUSTOM", t;
}({}), O_ = function(t) {
  return t[t.UNSPECIFIED = 0] = "UNSPECIFIED", t[t.TRADITIONAL = 1] = "TRADITIONAL", t[t.MODERN = 2] = "MODERN", t;
}({}), LC = function(t) {
  return t[t.DEFAULT = 0] = "DEFAULT", t[t.LINES = 1] = "LINES", t[t.LINES_AND_CHARS = 2] = "LINES_AND_CHARS", t[t.SNAP_TO_CHARS = 3] = "SNAP_TO_CHARS", t;
}({}), xC = function(t) {
  return t[t.SECTION_TYPE_UNSPECIFIED = 0] = "SECTION_TYPE_UNSPECIFIED", t[t.CONTINUOUS = 1] = "CONTINUOUS", t[t.NEXT_PAGE = 2] = "NEXT_PAGE", t[t.EVEN_PAGE = 3] = "EVEN_PAGE", t[t.ODD_PAGE = 4] = "ODD_PAGE", t;
}({}), FC = function(t) {
  return t[t.COLUMN_SEPARATOR_STYLE_UNSPECIFIED = 0] = "COLUMN_SEPARATOR_STYLE_UNSPECIFIED", t[t.NONE = 1] = "NONE", t[t.BETWEEN_EACH_COLUMN = 2] = "BETWEEN_EACH_COLUMN", t;
}({}), UC = function(t) {
  return t[t.NORMAL = 0] = "NORMAL", t[t.TBRL = 1] = "TBRL", t[t.LRTBV = 2] = "LRTBV", t;
}({}), PC = function(t) {
  return t[t.TEXT_RUN = 0] = "TEXT_RUN", t[t.AUTO_TEXT = 1] = "AUTO_TEXT", t[t.PAGE_BREAK = 2] = "PAGE_BREAK", t[t.COLUMN_BREAK = 3] = "COLUMN_BREAK", t[t.FOOT_NOTE_REFERENCE = 4] = "FOOT_NOTE_REFERENCE", t[t.HORIZONTAL_RULE = 5] = "HORIZONTAL_RULE", t[t.EQUATION = 6] = "EQUATION", t[t.DRAWING = 7] = "DRAWING", t[t.PERSON = 8] = "PERSON", t[t.RICH_LINK = 9] = "RICH_LINK", t;
}({}), kC = function(t) {
  return t[t.BOTH_SIDES = 0] = "BOTH_SIDES", t[t.LEFT = 1] = "LEFT", t[t.RIGHT = 2] = "RIGHT", t[t.LARGEST = 3] = "LARGEST", t;
}({}), BC = function(t) {
  return t[t.INLINE = 0] = "INLINE", t[t.WRAP_NONE = 1] = "WRAP_NONE", t[t.WRAP_POLYGON = 2] = "WRAP_POLYGON", t[t.WRAP_SQUARE = 3] = "WRAP_SQUARE", t[t.WRAP_THROUGH = 4] = "WRAP_THROUGH", t[t.WRAP_TIGHT = 5] = "WRAP_TIGHT", t[t.WRAP_TOP_AND_BOTTOM = 6] = "WRAP_TOP_AND_BOTTOM", t;
}({}), se = function(t) {
  return t[t.NAMED_STYLE_TYPE_UNSPECIFIED = 0] = "NAMED_STYLE_TYPE_UNSPECIFIED", t[t.NORMAL_TEXT = 1] = "NORMAL_TEXT", t[t.TITLE = 2] = "TITLE", t[t.SUBTITLE = 3] = "SUBTITLE", t[t.HEADING_1 = 4] = "HEADING_1", t[t.HEADING_2 = 5] = "HEADING_2", t[t.HEADING_3 = 6] = "HEADING_3", t[t.HEADING_4 = 7] = "HEADING_4", t[t.HEADING_5 = 8] = "HEADING_5", t;
}({}), HC = function(t) {
  return t[t.AUTO = 0] = "AUTO", t[t.AT_LEAST = 1] = "AT_LEAST", t[t.EXACT = 2] = "EXACT", t;
}({}), jC = function(t) {
  return t[t.DASH_STYLE_UNSPECIFIED = 0] = "DASH_STYLE_UNSPECIFIED", t[t.SOLID = 1] = "SOLID", t[t.DOT = 2] = "DOT", t[t.DASH = 3] = "DASH", t;
}({}), $C = function(t) {
  return t[t.TAB_STOP_ALIGNMENT_UNSPECIFIED = 0] = "TAB_STOP_ALIGNMENT_UNSPECIFIED", t[t.START = 1] = "START", t[t.CENTER = 2] = "CENTER", t[t.END = 3] = "END", t;
}({}), WC = function(t) {
  return t[t.UNSPECIFIED = 0] = "UNSPECIFIED", t[t.SPECIFIED = 1] = "SPECIFIED", t;
}({}), VC = function(t) {
  return t[t.START = 0] = "START", t[t.CENTER = 1] = "CENTER", t[t.END = 2] = "END", t;
}({}), GC = function(t) {
  return t[t.AUTO_FIT = 0] = "AUTO_FIT", t[t.FIXED = 1] = "FIXED", t;
}({}), YC = function(t) {
  return t[t.NONE = 0] = "NONE", t[t.WRAP = 1] = "WRAP", t;
}({}), zC = function(t) {
  return t[t.AUTO = 0] = "AUTO", t[t.AT_LEAST = 1] = "AT_LEAST", t[t.EXACT = 2] = "EXACT", t;
}({}), KC = function(t) {
  return t[t.CONTENT_ALIGNMENT_UNSPECIFIED = 0] = "CONTENT_ALIGNMENT_UNSPECIFIED", t[t.BOTH = 1] = "BOTH", t[t.TOP = 2] = "TOP", t[t.CENTER = 3] = "CENTER", t[t.BOTTOM = 4] = "BOTTOM", t;
}({}), ns = function(t) {
  return t.NORMAL = "normal", t.BOLD = "bold", t.ITALIC = "italic", t;
}({}), XC = function(t) {
  return t[t.PAGE = 0] = "PAGE", t[t.COLUMN = 1] = "COLUMN", t[t.CHARACTER = 2] = "CHARACTER", t[t.MARGIN = 3] = "MARGIN", t[t.INSIDE_MARGIN = 4] = "INSIDE_MARGIN", t[t.OUTSIDE_MARGIN = 5] = "OUTSIDE_MARGIN", t[t.LEFT_MARGIN = 6] = "LEFT_MARGIN", t[t.RIGHT_MARGIN = 7] = "RIGHT_MARGIN", t;
}({}), QC = function(t) {
  return t[t.PAGE = 0] = "PAGE", t[t.PARAGRAPH = 1] = "PARAGRAPH", t[t.LINE = 2] = "LINE", t[t.MARGIN = 3] = "MARGIN", t[t.TOP_MARGIN = 4] = "TOP_MARGIN", t[t.BOTTOM_MARGIN = 5] = "BOTTOM_MARGIN", t[t.INSIDE_MARGIN = 6] = "INSIDE_MARGIN", t[t.OUTSIDE_MARGIN = 7] = "OUTSIDE_MARGIN", t;
}({}), JC = function(t) {
  return t[t.POINT = 0] = "POINT", t[t.LINE = 1] = "LINE", t[t.CHARACTER = 2] = "CHARACTER", t[t.PIXEL = 3] = "PIXEL", t[t.PERCENT = 4] = "PERCENT", t;
}({}), ZC = function(t) {
  return t[t.CENTER = 0] = "CENTER", t[t.INSIDE = 1] = "INSIDE", t[t.LEFT = 2] = "LEFT", t[t.OUTSIDE = 3] = "OUTSIDE", t[t.RIGHT = 4] = "RIGHT", t[t.BOTH = 5] = "BOTH", t[t.DISTRIBUTE = 6] = "DISTRIBUTE", t;
}({}), qC = function(t) {
  return t[t.BOTTOM = 0] = "BOTTOM", t[t.CENTER = 1] = "CENTER", t[t.INSIDE = 2] = "INSIDE", t[t.OUTSIDE = 3] = "OUTSIDE", t[t.TOP = 4] = "TOP", t;
}({}), tR = function(t) {
  return t[t.compressPunctuation = 0] = "compressPunctuation", t[t.compressPunctuationAndJapaneseKana = 1] = "compressPunctuationAndJapaneseKana", t[t.doNotCompress = 2] = "doNotCompress", t;
}({}), eR = function(t) {
  return t[t.PORTRAIT = 0] = "PORTRAIT", t[t.LANDSCAPE = 1] = "LANDSCAPE", t;
}({}), Wt = function(t) {
  return t.Letter = "Letter", t.Tabloid = "Tabloid", t.Legal = "Legal", t.Statement = "Statement", t.Executive = "Executive", t.Folio = "Folio", t.A3 = "A3", t.A4 = "A4", t.A5 = "A5", t.B4 = "B4", t.B5 = "B5", t;
}({});
const nR = [Wt.A3, Wt.A4, Wt.A5, Wt.B4, Wt.B5, Wt.Letter, Wt.Tabloid, Wt.Legal, Wt.Statement, Wt.Executive, Wt.Folio];
let rR = function(t) {
  return t[t.forward = 0] = "forward", t[t.backward = 1] = "backward", t[t.front = 2] = "front", t[t.back = 3] = "back", t;
}({}), sR = function(t) {
  return t[t.UNRECOGNIZED = -1] = "UNRECOGNIZED", t[t.DRAWING_IMAGE = 0] = "DRAWING_IMAGE", t[t.DRAWING_SHAPE = 1] = "DRAWING_SHAPE", t[t.DRAWING_CHART = 2] = "DRAWING_CHART", t[t.DRAWING_TABLE = 3] = "DRAWING_TABLE", t[t.DRAWING_SMART_ART = 4] = "DRAWING_SMART_ART", t[t.DRAWING_VIDEO = 5] = "DRAWING_VIDEO", t[t.DRAWING_GROUP = 6] = "DRAWING_GROUP", t[t.DRAWING_UNIT = 7] = "DRAWING_UNIT", t[t.DRAWING_DOM = 8] = "DRAWING_DOM", t;
}({}), A_ = function(t) {
  return t[t.SLIDE = 0] = "SLIDE", t[t.MASTER = 1] = "MASTER", t[t.LAYOUT = 2] = "LAYOUT", t[t.HANDOUT_MASTER = 3] = "HANDOUT_MASTER", t[t.NOTES_MASTER = 4] = "NOTES_MASTER", t;
}({}), iR = function(t) {
  return t[t.SHAPE = 0] = "SHAPE", t[t.IMAGE = 1] = "IMAGE", t[t.TEXT = 2] = "TEXT", t[t.SPREADSHEET = 3] = "SPREADSHEET", t[t.DOCUMENT = 4] = "DOCUMENT", t[t.SLIDE = 5] = "SLIDE", t;
}({}), oR = function(t) {
  return t[t.RELATIVE_SLIDE_LINK_UNSPECIFIED = 0] = "RELATIVE_SLIDE_LINK_UNSPECIFIED", t[t.NEXT_SLIDE = 1] = "NEXT_SLIDE", t[t.PREVIOUS_SLIDE = 2] = "PREVIOUS_SLIDE", t[t.FIRST_SLIDE = 3] = "FIRST_SLIDE", t[t.LAST_SLIDE = 4] = "LAST_SLIDE", t;
}({});
function Ln() {
  return (t) => t;
}
const aR = Ln()(["s", "c", "cl", "t"]), lR = Ln()(["rgb", "th"]), uR = Ln()(["s", "cl"]), cR = Ln()(["t", "r", "b", "l", "tl_br", "tl_bc", "tl_mr", "bl_tr", "ml_tr", "bc_tr"]), dR = Ln()(["a", "v"]), hR = Ln()(["t", "r", "b", "l"]), fR = Ln()(["ff", "fs", "it", "bl", "ul", "bbl", "st", "ol", "bg", "bd", "cl", "va", "n", "tr", "td", "ht", "vt", "tb", "pd"]);
function N_(t = ce(6), e = Ta.EN_US, n = "") {
  return { id: t, locale: e, title: n, tableSource: {}, drawings: {}, drawingsOrder: [], headers: {}, footers: {}, body: { dataStream: `\r
`, textRuns: [], customBlocks: [], tables: [], paragraphs: [{ startIndex: 0, paragraphStyle: { spaceAbove: { v: 5 }, lineSpacing: 1, spaceBelow: { v: 0 } } }], sectionBreaks: [{ startIndex: 1 }] }, documentStyle: { pageSize: { width: 595 / 0.75, height: 842 / 0.75 }, documentFlavor: O_.TRADITIONAL, marginTop: 50, marginBottom: 50, marginRight: 50, marginLeft: 50, renderConfig: { zeroWidthParagraphBreak: z.FALSE, vertexAngle: 0, centerAngle: 0, background: { rgb: "#ccc" } }, autoHyphenation: z.TRUE, doNotHyphenateCaps: z.FALSE, consecutiveHyphenLimit: 2, defaultHeaderId: "", defaultFooterId: "", evenPageHeaderId: "", evenPageFooterId: "", firstPageHeaderId: "", firstPageFooterId: "", evenAndOddHeaders: z.FALSE, useFirstPageHeaderFooter: z.FALSE, marginHeader: 30, marginFooter: 30 }, settings: {} };
}
let ft = function(t) {
  return t[t.COVER = 0] = "COVER", t[t.REPLACE = 1] = "REPLACE", t;
}({}), x = function(t) {
  return t.RETAIN = "r", t.INSERT = "i", t.DELETE = "d", t;
}({});
const Qs = me("univer.config-service");
var D_ = class {
  constructor() {
    y(this, "_configChanged$", new ae()), y(this, "configChanged$", this._configChanged$.asObservable()), y(this, "_config", /* @__PURE__ */ new Map());
  }
  dispose() {
    this._config.clear(), this._configChanged$.complete();
  }
  getConfig(t) {
    return this._config.get(t);
  }
  setConfig(t, e, n) {
    var r;
    let { merge: s = !1 } = n || {}, i = (r = this._config.get(t)) == null ? {} : r;
    i = s ? So(i, e) : e, this._config.set(t, i), this._configChanged$.next({ [t]: i });
  }
  deleteConfig(t) {
    return this._config.delete(t);
  }
  subscribeConfigValue$(t) {
    return new ne((e) => {
      Object.prototype.hasOwnProperty.call(this._config, t) && e.next(this._config.get(t));
      let n = this.configChanged$.pipe(mn((r) => Object.prototype.hasOwnProperty.call(r, t))).subscribe((r) => e.next(r[t]));
      return () => n.unsubscribe();
    });
  }
};
const Wr = me("univer.context-service");
var M_ = class extends Qt {
  constructor(...t) {
    super(...t), y(this, "_contextChanged$", new ae()), y(this, "contextChanged$", this._contextChanged$.asObservable()), y(this, "_contextMap", /* @__PURE__ */ new Map());
  }
  dispose() {
    super.dispose(), this._contextChanged$.complete(), this._contextMap.clear();
  }
  getContextValue(t) {
    var e;
    return (e = this._contextMap.get(t)) == null ? !1 : e;
  }
  setContextValue(t, e) {
    this._contextMap.set(t, e), this._contextChanged$.next({ [t]: e });
  }
  subscribeContextValue$(t) {
    return new ne((e) => {
      let n = this._contextChanged$.pipe(mn((r) => r[t] !== void 0)).subscribe((r) => e.next(r[t]));
      return this._contextMap.has(t) && e.next(this._contextMap.get(t)), () => n.unsubscribe();
    });
  }
};
let Sn = function(t) {
  return t[t.SILENT = 0] = "SILENT", t[t.ERROR = 1] = "ERROR", t[t.WARN = 2] = "WARN", t[t.INFO = 3] = "INFO", t[t.VERBOSE = 4] = "VERBOSE", t;
}({});
const De = me("univer.log");
var L_ = class extends Qt {
  constructor(...t) {
    super(...t), y(this, "_logLevel", Sn.INFO), y(this, "_deduction", /* @__PURE__ */ new Set());
  }
  dispose() {
    super.dispose(), this._logLevel = Sn.INFO, this._deduction.clear();
  }
  debug(...t) {
    this._logLevel >= Sn.VERBOSE && this._log(console.debug, ...t);
  }
  log(...t) {
    this._logLevel >= Sn.INFO && this._log(console.log, ...t);
  }
  warn(...t) {
    this._logLevel >= Sn.WARN && this._log(console.warn, ...t);
  }
  error(...t) {
    this._logLevel >= Sn.ERROR && this._log(console.error, ...t);
  }
  deprecate(...t) {
    this._logLevel >= Sn.WARN && this._logWithDeduplication(console.error, ...t);
  }
  setLogLevel(t) {
    this._logLevel = t;
  }
  _log(t, ...e) {
    let n = e[0];
    /^\[(.*?)\]/g.test(n) ? t(`\x1B[97;104m${n}\x1B[0m`, ...e.slice(1)) : t(...e);
  }
  _logWithDeduplication(t, ...e) {
    let n = x_(...e);
    this._deduction.has(n) || (this._deduction.add(n), this._log(t, ...e));
  }
};
function x_(...t) {
  return t.map((e) => JSON.stringify(e)).join("");
}
function Ut(t, e) {
  return function(n, r) {
    e(n, r, t);
  };
}
function Ue(t, e, n, r) {
  var s = arguments.length, i = s < 3 ? e : r === null ? r = Object.getOwnPropertyDescriptor(e, n) : r, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, n, r);
  else for (var a = t.length - 1; a >= 0; a--) (o = t[a]) && (i = (s < 3 ? o(i) : s > 3 ? o(e, n, i) : o(e, n)) || i);
  return s > 3 && i && Object.defineProperty(e, n, i), i;
}
const F_ = "command.logExecution";
let on = function(t) {
  return t[t.COMMAND = 0] = "COMMAND", t[t.OPERATION = 1] = "OPERATION", t[t.MUTATION = 2] = "MUTATION", t;
}({});
const Js = me("univer.core.command-service");
var U_ = class {
  constructor() {
    y(this, "_commands", /* @__PURE__ */ new Map()), y(this, "_commandTypes", /* @__PURE__ */ new Map());
  }
  registerCommand(t) {
    if (this._commands.has(t.id)) throw Error(`[CommandRegistry]: command "${t.id}" has been registered before.`);
    return this._commands.set(t.id, t), this._commandTypes.set(t.id, t.type), Gt(() => {
      this.unregisterCommand(t.id);
    });
  }
  unregisterCommand(t) {
    this._commands.delete(t), this._commandTypes.delete(t);
  }
  hasCommand(t) {
    return this._commands.has(t);
  }
  getCommand(t) {
    return this._commands.has(t) ? [this._commands.get(t)] : null;
  }
  getCommandType(t) {
    return this._commandTypes.get(t);
  }
};
const P_ = { id: "nil", type: on.COMMAND, handler: () => !0 };
let Vi = class extends Qt {
  constructor(t, e, n) {
    super(), this._injector = t, this._logService = e, this._configService = n, y(this, "_commandRegistry", void 0), y(this, "_beforeCommandExecutionListeners", []), y(this, "_commandExecutedListeners", []), y(this, "_collabMutationListeners", []), y(this, "_multiCommandDisposables", /* @__PURE__ */ new Map()), y(this, "_commandExecutingLevel", 0), y(this, "_commandExecutionStack", []), this._commandRegistry = new U_(), this.registerCommand(P_);
  }
  dispose() {
    super.dispose(), this._commandExecutedListeners.length = 0, this._beforeCommandExecutionListeners.length = 0, this._collabMutationListeners.length = 0;
  }
  disposed() {
    return this._disposed;
  }
  hasCommand(t) {
    return this._commandRegistry.hasCommand(t);
  }
  registerCommand(t) {
    return this._commandRegistry.registerCommand(t);
  }
  unregisterCommand(t) {
    var e;
    this._commandRegistry.unregisterCommand(t), (e = this._multiCommandDisposables.get(t)) == null || e.dispose();
  }
  registerMultipleCommand(t) {
    return this._registerMultiCommand(t);
  }
  beforeCommandExecuted(t) {
    if (this._beforeCommandExecutionListeners.indexOf(t) === -1) return this._beforeCommandExecutionListeners.push(t), Gt(() => {
      let e = this._beforeCommandExecutionListeners.indexOf(t);
      this._beforeCommandExecutionListeners.splice(e, 1);
    });
    throw Error("[CommandService]: could not add a listener twice.");
  }
  onCommandExecuted(t) {
    if (this._commandExecutedListeners.indexOf(t) === -1) return this._commandExecutedListeners.push(t), Gt(() => {
      let e = this._commandExecutedListeners.indexOf(t);
      this._commandExecutedListeners.splice(e, 1);
    });
    throw Error("[CommandService]: could not add a listener twice.");
  }
  onMutationExecutedForCollab(t) {
    if (this._collabMutationListeners.indexOf(t) === -1) return this._collabMutationListeners.push(t), Gt(() => {
      let e = this._collabMutationListeners.indexOf(t);
      this._collabMutationListeners.splice(e, 1);
    });
    throw Error("[CommandService]: could not add a collab mutation listener twice.");
  }
  async executeCommand(t, e, n) {
    try {
      let r = this._commandRegistry.getCommand(t);
      if (r) {
        let [s] = r, i = { id: s.id, type: s.type, params: e }, o = this._pushCommandExecutionStack(i), a = n ?? {};
        this._beforeCommandExecutionListeners.forEach((u) => u(i, a));
        let l = await this._execute(s, e, a);
        return a.syncOnly || this._commandExecutedListeners.forEach((u) => u(i, a)), s.type === on.MUTATION && this._collabMutationListeners.forEach((u) => u(i, a)), o.dispose(), l;
      }
      throw Error(`[CommandService]: command "${t}" is not registered.`);
    } catch (r) {
      if (r instanceof $i) return !1;
      throw r;
    }
  }
  syncExecuteCommand(t, e, n) {
    try {
      let s = this._commandRegistry.getCommand(t);
      if (s) {
        let [i] = s, o = { id: i.id, type: i.type, params: e };
        if (i.type === on.MUTATION) {
          let c = e_(this._commandExecutionStack, (d) => d.type === on.COMMAND);
          if (c) {
            var r;
            o.params = (r = o.params) == null ? {} : r, o.params.trigger = c.id;
          }
        }
        let a = this._pushCommandExecutionStack(o), l = n ?? {};
        this._beforeCommandExecutionListeners.forEach((c) => c(o, l));
        let u = this._syncExecute(i, e, l);
        return l.syncOnly || this._commandExecutedListeners.forEach((c) => c(o, l)), i.type === on.MUTATION && this._collabMutationListeners.forEach((c) => c(o, l)), a.dispose(), u;
      }
      throw Error(`[CommandService]: command "${t}" is not registered.`);
    } catch (s) {
      if (s instanceof $i) return !1;
      throw s;
    }
  }
  _pushCommandExecutionStack(t) {
    return this._commandExecutionStack.push(t), Gt(() => Xs(this._commandExecutionStack, t));
  }
  _registerMultiCommand(t) {
    let e = this._commandRegistry.getCommand(t.id), n;
    if (e) {
      if (e[0].multi !== !0) throw Error("Command has registered as a single command.");
      n = e[0];
    } else {
      n = new k_(t.id);
      let s = new Ra();
      s.add(this._commandRegistry.registerCommand(n)), s.add(Gt(() => {
        this._multiCommandDisposables.delete(t.id);
      })), this._multiCommandDisposables.set(t.id, s);
    }
    let r = n.registerImplementation(t);
    return Gt(() => {
      if (r.dispose(), !n.hasImplementations()) {
        var s;
        (s = this._multiCommandDisposables.get(t.id)) == null || s.dispose();
      }
    });
  }
  async _execute(t, e, n) {
    if (n != null && n.syncOnly) return !0;
    this._configService.getConfig("command.logExecution") !== !1 && this._logService.debug("[CommandService]", `${"|-".repeat(Math.max(this._commandExecutingLevel, 0))}executing command "${t.id}"`), this._commandExecutingLevel++;
    let r;
    try {
      r = await this._injector.invoke(t.handler, e, n), this._commandExecutingLevel--;
    } catch (s) {
      throw r = !1, this._commandExecutingLevel = 0, s;
    }
    return r;
  }
  _syncExecute(t, e, n) {
    if (n != null && n.syncOnly) return !0;
    this._configService.getConfig("command.logExecution") !== !1 && this._logService.debug("[CommandService]", `${"|-".repeat(Math.max(0, this._commandExecutingLevel))}executing command "${t.id}".`), this._commandExecutingLevel++;
    let r;
    try {
      if (r = this._injector.invoke(t.handler, e, n), r instanceof Promise) throw TypeError("[CommandService]: Command handler should not return a promise.");
      this._commandExecutingLevel--;
    } catch (s) {
      throw r = !1, this._commandExecutingLevel = 0, s;
    }
    return r;
  }
};
Vi = Ue([Ut(0, Le(Nn)), Ut(1, De), Ut(2, Qs)], Vi);
var k_ = class {
  constructor(t) {
    this.id = t, y(this, "name", void 0), y(this, "multi", !0), y(this, "type", on.COMMAND), y(this, "priority", 0), y(this, "_implementations", []), y(this, "handler", async (e, n) => {
      if (!this._implementations.length) return !1;
      let r = e.get(De), s = e.get(Wr), i = e.get(Nn);
      for (let o of this._implementations) {
        let a = o.command.preconditions;
        if ((!a || a && a(s)) && (r.debug("[MultiCommand]", `executing implementation "${o.command.name}".`), await i.invoke(o.command.handler, n))) return !0;
      }
      return !1;
    }), this.name = t;
  }
  registerImplementation(t) {
    let e = { command: t };
    return this._implementations.push(e), this._implementations.sort((n, r) => r.command.priority - n.command.priority), Gt(() => {
      let n = this._implementations.indexOf(e);
      this._implementations.splice(n, 1);
    });
  }
  hasImplementations() {
    return this._implementations.length > 0;
  }
};
function wa(t, e, n) {
  return C_(t.map((r) => () => e.syncExecuteCommand(r.id, r.params, n)));
}
function pR(t, e, n) {
  return v_(t.map((r) => () => e.executeCommand(r.id, r.params, n)));
}
function B_(t) {
  return new ne((e) => {
    let n = t((...r) => e.next(r));
    return () => n == null ? void 0 : n.dispose();
  });
}
function Wl(t) {
  return function(e) {
    return new ne((n) => (e.subscribe({ next: (r) => {
      n.next(r), t(r) && n.complete();
    }, complete: () => n.complete(), error: (r) => n.error(r) }), () => n.unsubscribe()));
  };
}
function gR(t = 0) {
  return (e) => {
    let n = [];
    return e.pipe(ml((r) => n.push(r)), fc(t), or(() => n), ml(() => n = []));
  };
}
function mR(t) {
  let e = new wg(1);
  return setTimeout(() => e.next(), t), e.pipe(pc(1));
}
function _R(t, e) {
  let n = new de(e);
  return t.subscribe(n), n;
}
const yR = (t) => new Promise((e) => {
  hc(B_(t.onCommandExecuted.bind(t)).pipe(mn(([n]) => n.type === on.MUTATION)), um(300)).pipe(fc(16), gm()).subscribe(() => {
    e();
  });
});
function H_(t, e) {
  let n = 0, r = t.length - 1;
  if (e < t[0]) return 0;
  if (e >= t[t.length - 1]) return t.length - 1;
  for (; n <= r; ) {
    if (t[n] === e) {
      for (; n < t.length && t[n] === e; ) n++;
      return n;
    }
    if (e > t[n] && e < t[n + 1]) return n + 1;
    if (t[r] === e) {
      for (; r < t.length && t[r] === e; ) r++;
      return r;
    }
    if (e > t[r - 1] && e < t[r]) return r;
    n++, r--;
  }
  return -1;
}
function ER(t, e) {
  let n = 0, r = t.length - 1;
  for (; n <= r; ) {
    let s = Math.floor((r + n) / 2);
    if (e < t[s] && (s === 0 || e >= t[s - 1])) return s;
    if (e >= t[s]) n = s + 1;
    else if (e < t[s]) r = s - 1;
    else return -1;
  }
  return -1;
}
function j_(t, e) {
  let n = 0, r = t.length;
  for (; n < r; ) {
    let s = Math.floor((n + r) / 2);
    t[s] <= e ? n = s + 1 : r = s;
  }
  return n < t.length ? n : t.length - 1;
}
function rs(t, e, n = !1) {
  let r = t.length - 1;
  if (e < 0 || e < t[0]) return 0;
  if (r = t.length < 40 || e <= t[20] || e >= t[r - 20] ? H_(t, e) : j_(t, e), n) {
    let s = t[r];
    return t.indexOf(s);
  }
  return r;
}
function vR(t) {
  let e = new Blob([t], { type: "text/javascript" });
  return window.URL.createObjectURL(e);
}
const CR = 2, RR = 1;
function bR(t, e) {
  if (e == null || t == null) return !0;
  let { left: n = 0, top: r = 0, height: s = 0, width: i = 0, angle: o = 0 } = e, { left: a = 0, top: l = 0, height: u = 0, width: c = 0, angle: d = 0 } = t, h = c, f = u, p = i, g = s;
  return Math.abs(a - n) > 2 || Math.abs(l - r) > 2 || Math.abs(h - p) > 2 || Math.abs(f - g) > 2 || Math.abs(d - o) > 1;
}
const IR = "rgb(", TR = "rgba(", Vl = { aliceblue: [240, 248, 255], antiquewhite: [250, 235, 215], aqua: [0, 255, 255], aquamarine: [127, 255, 212], azure: [240, 255, 255], beige: [245, 245, 220], bisque: [255, 228, 196], black: [0, 0, 0], blanchealmond: [255, 235, 205], blue: [0, 0, 255], blueviolet: [138, 43, 226], brown: [165, 42, 42], burlywood: [222, 184, 135], cadetblue: [95, 158, 160], chartreuse: [127, 255, 0], chocolate: [210, 105, 30], coral: [255, 127, 80], cornflowerblue: [100, 149, 237], cornsilk: [255, 248, 220], crimson: [220, 20, 60], cyan: [0, 255, 255], darkblue: [0, 0, 139], darkcyan: [0, 139, 139], darkgoldenrod: [184, 132, 11], darkgray: [169, 169, 169], darkgreen: [0, 100, 0], darkgrey: [169, 169, 169], darkkhaki: [189, 183, 107], darkmagenta: [139, 0, 139], darkolivegreen: [85, 107, 47], darkorange: [255, 140, 0], darkorchid: [153, 50, 204], darkred: [139, 0, 0], darksalmon: [233, 150, 122], darkseagreen: [143, 188, 143], darkslateblue: [72, 61, 139], darkslategray: [47, 79, 79], darkslategrey: [47, 79, 79], darkturquoise: [0, 206, 209], darkviolet: [148, 0, 211], darkyellow: [139, 128, 0], deeppink: [255, 20, 147], deepskyblue: [0, 191, 255], dimgray: [105, 105, 105], dimgrey: [105, 105, 105], dodgerblue: [30, 144, 255], firebrick: [178, 34, 34], floralwhite: [255, 255, 240], forestgreen: [34, 139, 34], fuchsia: [255, 0, 255], gainsboro: [220, 220, 220], ghostwhite: [248, 248, 255], gold: [255, 215, 0], goldenrod: [218, 165, 32], gray: [128, 128, 128], green: [0, 128, 0], greenyellow: [173, 255, 47], grey: [128, 128, 128], honeydew: [240, 255, 240], hotpink: [255, 105, 180], indianred: [205, 92, 92], indigo: [75, 0, 130], ivory: [255, 255, 240], khaki: [240, 230, 140], lavender: [230, 230, 250], lavenderblush: [255, 240, 245], lawngreen: [124, 252, 0], lemonchiffon: [255, 250, 205], lightblue: [173, 216, 230], lightcoral: [240, 128, 128], lightcyan: [224, 255, 255], lightgoldenrodyellow: [250, 250, 210], lightgray: [211, 211, 211], lightgreen: [144, 238, 144], lightgrey: [211, 211, 211], lightpink: [255, 182, 193], lightsalmon: [255, 160, 122], lightseagreen: [32, 178, 170], lightskyblue: [135, 206, 250], lightslategray: [119, 136, 153], lightslategrey: [119, 136, 153], lightsteelblue: [176, 196, 222], lightyellow: [255, 255, 224], lime: [0, 255, 0], limegreen: [50, 205, 50], linen: [250, 240, 230], magenta: [255, 0, 255], maroon: [128, 0, 0], mediumaquamarine: [102, 205, 170], mediumblue: [0, 0, 205], mediumorchid: [186, 85, 211], mediumpurple: [147, 112, 219], mediumseagreen: [60, 179, 113], mediumslateblue: [123, 104, 238], mediumspringgreen: [0, 250, 154], mediumturquoise: [72, 209, 204], mediumvioletred: [199, 21, 133], midbightblue: [25, 25, 112], mintcream: [245, 255, 250], mistyrose: [255, 228, 225], moccasin: [255, 228, 181], navajowhite: [255, 222, 173], navy: [0, 0, 128], oldlace: [253, 245, 230], olive: [128, 128, 0], olivedrab: [107, 142, 35], orange: [255, 165, 0], orangered: [255, 69, 0], orchid: [218, 112, 214], palegoldenrod: [238, 232, 170], palegreen: [152, 251, 152], paleturquoise: [175, 238, 238], palevioletred: [219, 112, 147], papayawhip: [255, 239, 213], peachpuff: [255, 218, 185], peru: [205, 133, 63], pink: [255, 192, 203], plum: [221, 160, 203], powderblue: [176, 224, 230], purple: [128, 0, 128], rebeccapurple: [102, 51, 153], red: [255, 0, 0], rosybrown: [188, 143, 143], royalblue: [65, 105, 225], saddlebrown: [139, 69, 19], salmon: [250, 128, 114], sandybrown: [244, 164, 96], seagreen: [46, 139, 87], seashell: [255, 245, 238], sienna: [160, 82, 45], silver: [192, 192, 192], skyblue: [135, 206, 235], slateblue: [106, 90, 205], slategray: [119, 128, 144], slategrey: [119, 128, 144], snow: [255, 255, 250], springgreen: [0, 255, 127], steelblue: [70, 130, 180], tan: [210, 180, 140], teal: [0, 128, 128], thistle: [216, 191, 216], transparent: [255, 255, 255, 0], tomato: [255, 99, 71], turquoise: [64, 224, 208], violet: [238, 130, 238], wheat: [245, 222, 179], white: [255, 255, 255], whitesmoke: [245, 245, 245], yellow: [255, 255, 0], yellowgreen: [154, 205, 5] };
var Gl = class ze {
  static mix(e, n, r) {
    var s, i;
    r = Math.min(1, Math.max(0, r));
    let o = new ze(e).toRgb(), a = new ze(n).toRgb(), l = (s = o.a) == null ? 1 : s, u = (i = a.a) == null ? 1 : i;
    return new ze({ r: (a.r - o.r) * r + o.r, g: (a.g - o.g) * r + o.g, b: (a.b - o.b) * r + o.b, a: (u - l) * r + l });
  }
  static getContrastRatio(e, n) {
    let r = new ze(e).getLuminance(), s = new ze(n).getLuminance();
    return (Math.max(r, s) + 0.05) / (Math.min(r, s) + 0.05);
  }
  constructor(e) {
    if (y(this, "_color", void 0), y(this, "_rgbColor", void 0), y(this, "_isValid", !1), e == null) {
      this._setNullColor();
      return;
    }
    if (e instanceof ze) {
      this._color = { ...e._color }, this._rgbColor = { ...e._rgbColor };
      return;
    }
    let n = ld(e);
    if (n == null) {
      this._setNullColor();
      return;
    }
    this._color = n;
    let r = Y_(this._color);
    if (r == null) {
      this._setNullColor();
      return;
    }
    this._rgbColor = r, this._isValid = !0;
  }
  get isValid() {
    return this._isValid;
  }
  toRgb() {
    return this._rgbColor;
  }
  toRgbString() {
    let { r: e, g: n, b: r, a: s = 1 } = this.toRgb(), i = s < 1;
    return `rgb${i ? "a" : ""}(${e},${n},${r}${i ? `,${s}` : ""})`;
  }
  toString() {
    return this.toRgbString();
  }
  toHexString(e) {
    let { r: n, g: r, b: s, a: i = 1 } = this.toRgb(), o = i < 1, a = [ss(Math.round(n).toString(16)), ss(Math.round(r).toString(16)), ss(Math.round(s).toString(16)), ss(Math.round(i * 255).toString(16))];
    return e && a[0][0] === a[0][1] && a[1][0] === a[1][1] && a[2][0] === a[2][1] && a[3][0] === a[3][1] ? o ? `#${a[0][0]}${a[1][0]}${a[2][0]}${a[3][0]}` : `#${a[0][0]}${a[1][0]}${a[2][0]}` : o ? `#${a[0]}${a[1]}${a[2]}${a[3]}` : `#${a[0]}${a[1]}${a[2]}`;
  }
  toHsv() {
    return Q_(this.toRgb());
  }
  toHsl() {
    return X_(this.toRgb());
  }
  lighten(e = 10) {
    let n = this.toHsl();
    return n.l += e, n.l = Math.min(Math.max(n.l, 0), 100), new ze(n);
  }
  darken(e = 10) {
    let n = this.toHsl();
    return n.l -= e, n.l = Math.min(Math.max(n.l, 0), 100), new ze(n);
  }
  setAlpha(e) {
    return new ze({ ...this._rgbColor, a: e });
  }
  getLuminance() {
    let { r: e, g: n, b: r } = this.toRgb();
    return e = bi(e), n = bi(n), r = bi(r), Number((0.2126 * e + 0.7152 * n + 0.0722 * r).toFixed(3));
  }
  getBrightness() {
    let { r: e, g: n, b: r } = this.toRgb();
    return (e * 299 + n * 587 + r * 114) / 1e3;
  }
  getAlpha() {
    var e;
    return (e = this._color.a) == null ? 1 : e;
  }
  isDark() {
    return this.getBrightness() < 128;
  }
  isLight() {
    return !this.isDark();
  }
  _setNullColor() {
    this._isValid = !1, this._color = { r: 0, g: 0, b: 0, a: 0 }, this._rgbColor = { r: 0, g: 0, b: 0, a: 0 };
  }
};
const ss = (t) => t.length === 1 ? `0${t}` : t, bi = (t) => (t /= 255, t <= 0.03928 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4), ld = (t) => {
  if (Z_(t)) {
    if ("r" in t) {
      let r = { r: Math.round(t.r), g: Math.round(t.g), b: Math.round(t.b) };
      return t.a !== void 0 && (r.a = t.a), r;
    }
    if ("l" in t) {
      let r = { h: Math.round(t.h), s: t.s, l: t.l };
      return t.a !== void 0 && (r.a = t.a), r;
    }
    let n = { h: Math.round(t.h), s: t.s, v: t.v };
    return t.a !== void 0 && (n.a = t.a), n;
  }
  let e = t.trim().toLowerCase();
  if (Vl[e]) {
    let n = Vl[e], r = { r: Math.round(n[0]), g: Math.round(n[1]), b: Math.round(n[2]) };
    return r.a = n[3] || 1, r;
  }
  if (e.startsWith("#")) return $_(e);
  if (e.startsWith("rgb")) return W_(e);
  if (e.startsWith("hsl")) return V_(e);
  if (e.startsWith("hsv")) return G_(e);
}, $_ = (t) => {
  let e = t.substring(1), n = RegExp(`.{1,${e.length >= 6 ? 2 : 1}}`, "g"), r = e.match(n);
  if (!r || r.length < 3) throw Error(`The color '${t}' is illegal hex color`);
  r[0].length === 1 && (r = r.map((i) => i + i));
  let s = { r: Number.parseInt(r[0], 16), g: Number.parseInt(r[1], 16), b: Number.parseInt(r[2], 16) };
  return r.length > 3 && (s.a = Number.parseInt(r[3], 16) / 255), s;
}, W_ = (t) => {
  let e = t.indexOf("(");
  if (e === -1) throw Error(`The color '${t}' is illegal rgb color`);
  let n = t.substring(e + 1, t.length - 1).split(",");
  if (n.length < 3) throw Error(`The color '${t}' is illegal rgb color`);
  let r = { r: Number.parseInt(n[0], 10), g: Number.parseInt(n[1], 10), b: Number.parseInt(n[2], 10) };
  return n.length > 3 && (r.a = Number.parseFloat(n[3])), r;
}, V_ = (t) => {
  let e = t.indexOf("(");
  if (e === -1) throw Error(`The color '${t}' is illegal hsl color`);
  let n = t.substring(e + 1, t.length - 1).split(",");
  if (n.length < 3) throw Error(`The color '${t}' is illegal hsl color`);
  let r = { h: Number.parseInt(n[0], 10), s: Number.parseFloat(n[1]), l: Number.parseFloat(n[2]) };
  return n.length > 3 && (r.a = Number.parseFloat(n[3])), r;
}, G_ = (t) => {
  let e = t.indexOf("(");
  if (e === -1) throw Error(`The color '${t}' is illegal hsv color`);
  let n = t.substring(e + 1, t.length - 1).split(",");
  if (n.length < 3) throw Error(`The color '${t}' is illegal hsv color`);
  let r = { h: Number.parseInt(n[0], 10), s: Number.parseFloat(n[1]), v: Number.parseFloat(n[2]) };
  return n.length > 3 && (r.a = Number.parseFloat(n[3])), r;
}, Y_ = (t) => {
  let e = ld(t);
  if (e != null) return "r" in e ? e : "l" in e ? z_(e) : K_(e);
}, Ii = (t, e, n) => (n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? t + (e - t) * 6 * n : n < 1 / 2 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t), z_ = (t) => {
  let { h: e, s: n, l: r } = t;
  e /= 360, n /= 100, r /= 100;
  let s = 0, i = 0, o = 0;
  if (n === 0) s = i = o = r;
  else {
    let l = r < 0.5 ? r * (1 + n) : r + n - r * n, u = 2 * r - l;
    s = Ii(u, l, e + 1 / 3), i = Ii(u, l, e), o = Ii(u, l, e - 1 / 3);
  }
  let a = { r: Math.round(s * 255), g: Math.round(i * 255), b: Math.round(o * 255) };
  return t.a !== void 0 && (a.a = t.a), a;
}, K_ = (t) => {
  let { h: e, s: n, v: r } = t;
  e = e / 360 * 6, n /= 100, r /= 100;
  let s = Math.floor(e), i = e - s, o = r * (1 - n), a = r * (1 - i * n), l = r * (1 - (1 - i) * n), u = s % 6, c = [r, a, o, o, l, r][u], d = [l, r, r, a, o, o][u], h = [o, o, l, r, r, a][u], f = { r: c * 255, g: d * 255, b: h * 255 };
  return t.a !== void 0 && (f.a = t.a), f;
}, X_ = (t) => {
  let { r: e, g: n, b: r } = t;
  e /= 255, n /= 255, r /= 255;
  let s = Math.max(e, n, r), i = Math.min(e, n, r), o = (s + i) / 2, a, l;
  if (s === i) a = l = 0;
  else {
    let c = s - i;
    switch (l = o > 0.5 ? c / (2 - s - i) : c / (s + i), s) {
      case e:
        a = (n - r) / c + (n < r ? 6 : 0);
        break;
      case n:
        a = (r - e) / c + 2;
        break;
      default:
        a = (e - n) / c + 4;
        break;
    }
    a /= 6;
  }
  let u = { h: Math.round(a * 360), s: Math.round(l * 100), l: Math.round(o * 100) };
  return t.a !== void 0 && (u.a = t.a), u;
}, Q_ = (t) => {
  let { r: e, g: n, b: r } = t;
  e /= 255, n /= 255, r /= 255;
  let s = Math.max(e, n, r), i = Math.min(e, n, r), o, a = s, l = s - i, u = s === 0 ? 0 : l / s;
  if (s === i) o = 0;
  else {
    switch (s) {
      case e:
        o = (n - r) / l + (n < r ? 6 : 0);
        break;
      case n:
        o = (r - e) / l + 2;
        break;
      default:
        o = (e - n) / l + 4;
        break;
    }
    o /= 6;
  }
  let c = { h: Math.round(o * 360), s: Math.round(u * 100), v: Math.round(a * 100) };
  return t.a !== void 0 && (c.a = t.a), c;
}, J_ = (t) => t == null, Z_ = (t) => !J_(t) && typeof t == "object";
function SR(t) {
  return !!(/^#(?:[0]{3}|[0]{6})\b/.test(t) || /^rgb\s*\(\s*0+\s*,\s*0+\s*,\s*0+\s*\)$/.test(t) || /^rgba\s*\(\s*0+\s*,\s*0+\s*,\s*0+\s*,\s*(1|1\.0*|0?\.\d+)\)$/.test(t) || /^hsl\s*\(\s*0*\s*,\s*0%*\s*,\s*0%*\s*\)$/.test(t) || /^hsla\s*\(\s*0*\s*,\s*0%*\s*,\s*0%*\s*,\s*(1|1\.0*|0?\.\d+)\)$/.test(t));
}
function wR(t) {
  return !!(/^#(?:[Ff]{3}|[Ff]{6})\b/.test(t) || /^rgb\s*\(\s*255\s*,\s*255\s*,\s*255\s*\)$/.test(t) || /^rgba\s*\(\s*255\s*,\s*255\s*,\s*255\s*,\s*(1|1\.0*|0?\.\d+)\)$/.test(t) || /^hsl\s*\(\s*0*\s*,\s*0%*\s*,\s*100%*\s*\)$/.test(t) || /^hsla\s*\(\s*0*\s*,\s*0%*\s*,\s*100%*\s*,\s*(1|1\.0*|0?\.\d+)\)$/.test(t));
}
function q_(t) {
  return t && (t.s !== void 0 || t.p !== void 0 || t.v !== void 0 || t.t !== void 0 || t.f !== void 0 || t.si !== void 0 || t.custom !== void 0);
}
function OR(t) {
  if (t.t !== void 0) return t.t;
  if (typeof t.v == "string") return Xn.STRING;
  if (typeof t.v == "number") return Xn.NUMBER;
  if (typeof t.v == "boolean") return Xn.BOOLEAN;
}
function AR(t) {
  if (t == null) return !0;
  let { v: e, f: n, si: r, p: s, custom: i } = t;
  return !(!(e == null || typeof e == "string" && e.length === 0) || n != null && n.length > 0 || r != null && r.length > 0 || s != null || i != null);
}
function ty(t) {
  return t != null && (typeof t == "string" || typeof t == "number" || typeof t == "boolean");
}
let at = function(t) {
  return t[t.NORMAL = 0] = "NORMAL", t[t.ROW = 1] = "ROW", t[t.COLUMN = 2] = "COLUMN", t[t.ALL = 3] = "ALL", t;
}({}), wt = function(t) {
  return t[t.NONE = 0] = "NONE", t[t.ROW = 1] = "ROW", t[t.COLUMN = 2] = "COLUMN", t[t.ALL = 3] = "ALL", t;
}({});
function NR(t) {
  return [t.startRow, t.startColumn, t.endRow, t.endColumn];
}
let DR = function(t) {
  return t.NONE = "none", t.BACKWARD = "backward", t.FORWARD = "forward", t;
}({}), MR = function(t) {
  return t.RECT = "RECT", t.TEXT = "TEXT", t;
}({});
function LR(t, e, n) {
  let r = !1, s = !1, i = t, o = e, a = t, l = e;
  if (n == null) return { actualRow: t, actualColumn: e, isMergedMainCell: s, isMerged: r, endRow: i, endColumn: o, startRow: a, startColumn: l };
  for (let u = 0; u < n.length; u++) {
    let { startRow: c, endRow: d, startColumn: h, endColumn: f } = n[u];
    if (t === c && e === h) {
      i = d, o = f, a = c, l = h, s = !0;
      break;
    }
    if (t >= c && t <= d && e >= h && e <= f) {
      i = d, o = f, a = c, l = h, r = !0;
      break;
    }
  }
  return { actualRow: t, actualColumn: e, isMergedMainCell: s, isMerged: r, endRow: i, endColumn: o, startRow: a, startColumn: l };
}
let is = function(t) {
  return t.Raw = "raw", t.Intercepted = "intercepted", t.Both = "both", t;
}({});
const ey = { [ad.OFFICE]: { [we.ACCENT1]: "#4472C4", [we.ACCENT2]: "#ED7D31", [we.ACCENT3]: "#A5A5A5", [we.ACCENT4]: "#70AD47", [we.ACCENT5]: "#5B9BD5", [we.ACCENT6]: "#70AD47", [we.DARK1]: "#000000", [we.DARK2]: "#44546A", [we.LIGHT1]: "#FFFFFF", [we.LIGHT2]: "#E7E6E6", [we.HYPERLINK]: "#0563C1", [we.FOLLOWED_HYPERLINK]: "#954F72" } }, xR = "@@@", FR = "@", UR = "General";
function PR(t) {
  return t === "@@@" || t === "@";
}
function kR(t) {
  return t == null || t === "General";
}
const BR = (t, e) => {
  if (t && !e || !t && e) return !1;
  let n = (r) => {
    let s = Gn(r), i = "", o = !1, a = !1;
    for (let l of s) {
      if (l.type === jn.POINT) {
        o = !0;
        continue;
      }
      if (!(a && l.type === jn.MINUS) && l.type !== jn.SKIP) {
        if (l.type === jn.COLOR) {
          a = !0;
          continue;
        } else a = !1;
        o && l.type === jn.ZERO || (o = !1, o || (i += l.value || ""));
      }
    }
    return i;
  };
  return n(t) === n(e);
}, ny = /* @__PURE__ */ new Set(["m d"]), ry = /* @__PURE__ */ new Set(["h:mm AM/PM", "hh:mm AM/PM"]), sy = /* @__PURE__ */ new Set(["$", "¥", "₽", "₫", "NT$", "€", "₩", "﷼"]), iy = (t) => {
  var e, n;
  let r = (e = (n = ya(t)) == null ? Ys(t) : n) == null ? _a(t) : e;
  if (!r) return null;
  let { z: s } = r;
  if (s) {
    if (ny.has(s) || ry.has(s) && !/\s(A|AM|P|PM)$/i.test(t)) return null;
    if (s.includes("#,##0")) {
      if (/[.,]$/.test(t)) return null;
      let i = t.replace(RegExp(`^[${[...sy].join("")}]+`), "").trim();
      if (i.includes(",") && !/^-?\d{1,3}(,\d{3})*(\.\d+)?$/.test(i)) return null;
    }
  }
  return r;
};
function HR(t, e) {
  let n = {};
  for (let r in t) {
    let s = Number(r), i = t[s];
    for (let o in i) {
      let a = Number(o), l = i[a], u = e(s, a, l);
      u !== void 0 && (n[s] ? n[s][a] = u : n[s] = { [a]: u });
    }
  }
  return n;
}
function wn(t) {
  let e = 0, n = Object.keys(t);
  for (let r of n) {
    let s = Number(r);
    e = Math.max(e, s);
  }
  return e + 1;
}
const Yl = (t) => t == null || typeof t == "object" && Object.keys(t).length === 0;
function jR(t, e, n) {
  let r = wn(n), s = n;
  for (let i = r - 1; i >= t; i--) Yl(s[i]) ? delete s[i + 1] : s[i + 1] = s[i];
  Yl(e) || (s[t] = e);
}
function zl(t, e, n) {
  let r = Object.keys(n).reduce((s, i) => Math.max(s, Number.parseInt(i)), 0) + 1;
  for (let s = t; s < r; s++) s < t + e ? delete n[s] : n[s] !== void 0 && (n[s - e] = n[s], delete n[s]);
}
function $R(t, e) {
  let n = t, r = Object.keys(n), s = r.length, i = e, o = Object.keys(i), a = o.length, l = {}, u = 0;
  for (let c = 0; c < s; c++, u++) l[u] = n[r[c]];
  for (let c = 0; c < a; c++, u++) l[u] = i[o[c]];
  return l;
}
function WR(t, e, n) {
  let r = n;
  if (wn(n) > 0) {
    let s = {}, i = 0;
    for (let o = t; o <= e; o++) r[o] && (s[i] = r[o], i++);
    return s;
  }
  return {};
}
function Kl(t, e, n, r) {
  let s = t > n;
  if (!s && t + e > n) throw Error("Invalid move operation");
  s ? oy(t, e, n, r) : ay(t, e, n, r);
}
function oy(t, e, n, r) {
  let s = r, i = [];
  for (let o = t; o < t + e; o++) i.push(s[o]);
  for (let o = t - 1; o >= n; o--) {
    let a = s[o];
    s[o + e] = a, a === void 0 && delete s[o + e];
  }
  i.forEach((o, a) => {
    s[n + a] = o, o === void 0 && delete s[n + a];
  });
}
function ay(t, e, n, r) {
  let s = r, i = [];
  for (let o = t; o < t + e; o++) i.push(s[o]);
  for (let o = t + e; o < n; o++) {
    let a = s[o];
    s[o - e] = a, a === void 0 && delete s[o - e];
  }
  i.forEach((o, a) => {
    s[n + a - e] = o, o === void 0 && delete s[n + a - e];
  });
}
var An = class Wn {
  constructor(e = {}) {
    y(this, "_matrix", void 0), this._setOriginValue(e);
  }
  static MakeObjectMatrixSize(e) {
    return new Wn({ [e - 1]: {} });
  }
  getMatrix() {
    return this._matrix;
  }
  forEach(e) {
    let n = this._matrix, r = Object.keys(n);
    for (let s of r) {
      let i = Number(s), o = n[i];
      if (e(i, o) === !1) return this;
    }
    return this;
  }
  forRow(e) {
    let n = this._matrix, r = Object.keys(n);
    for (let s of r) {
      let i = Number(s), o = n[i];
      if (e(i, Object.keys(o).map((a) => Number(a))) === !1) return this;
    }
    return this;
  }
  forValue(e) {
    let n = this._matrix;
    for (let r in n) {
      let s = Number(r), i = n[s];
      if (i) for (let o in i) {
        let a = Number(o), l = i[a];
        if (e(s, a, l) === !1) return this;
      }
    }
    return this;
  }
  swapRow(e, n) {
    let r = this._matrix[e], s = this._matrix[n];
    this._matrix[e] = s, this._matrix[n] = r;
  }
  getRow(e) {
    return this._matrix[e];
  }
  getRowOrCreate(e) {
    let n = this.getRow(e);
    return n == null && (n = {}, this._matrix[e] = n), n;
  }
  reset() {
    this._setOriginValue({});
  }
  hasValue() {
    let e = this._matrix, n = Object.keys(e);
    if (n.length === 0) return !1;
    for (let r of n) {
      let s = e[Number(r)];
      if (Object.keys(s).length > 0) return !0;
    }
    return !1;
  }
  getValue(e, n) {
    var r;
    return (r = this._matrix) == null || (r = r[e]) == null ? void 0 : r[n];
  }
  setValue(e, n, r) {
    let s = this.getRowOrCreate(e);
    s[n] = r;
  }
  deleteValue(e, n) {
    var r;
    (r = this._matrix) == null || (r = r[e]) == null || delete r[n];
  }
  realDeleteValue(e, n) {
    var r;
    if ((r = this._matrix) == null || (r = r[e]) == null || delete r[n], this.getRow(e)) {
      let i = this.getRow(e);
      if (i == null) return;
      if (Object.keys(i).length === 0) {
        var s;
        (s = this._matrix) == null || delete s[e];
      }
    }
  }
  setRow(e, n) {
    this._matrix[e] = n;
  }
  moveRows(e, n, r) {
    Kl(e, n, r, this._matrix);
  }
  moveColumns(e, n, r) {
    this.forEach((s, i) => {
      Kl(e, n, r, i);
    });
  }
  insertRows(e, n) {
    let r = Object.keys(this._matrix);
    for (let s = r.length - 1; s >= 0; s--) {
      let i = Number(r[s]);
      if (i >= e) {
        let o = this._matrix[i];
        delete this._matrix[i], this._matrix[i + n] = o;
      }
    }
  }
  insertColumns(e, n) {
    let r = Object.keys(this._matrix);
    for (let s = 0; s < r.length; s++) {
      let i = Number(r[s]), o = this._matrix[i], a = Object.keys(o);
      for (let l = a.length - 1; l >= 0; l--) {
        let u = Number(a[l]);
        if (u >= e) {
          let c = o[u];
          delete o[u], o[u + n] = c;
        }
      }
    }
  }
  removeRows(e, n) {
    zl(e, n, this._matrix);
  }
  removeColumns(e, n) {
    this.forEach((r, s) => {
      s && zl(e, n, s);
    });
  }
  getFragment(e, n, r, s) {
    let i = new Wn(), o = 0;
    for (let a = e; a <= n; a++) {
      let l = {}, u = 0;
      for (let c = r; c <= s; c++) l[u] = this.getValue(a, c), u++;
      i.setRow(o, l), o++;
    }
    return i;
  }
  getSlice(e, n, r, s) {
    let i = new Wn();
    for (let o = e; o <= n; o++) for (let a = r; a <= s; a++) {
      let l = this.getValue(o, a);
      l && i.setValue(o, a, j.deepClone(l));
    }
    return i;
  }
  getSliceDataAndCellCountByRows(e, n) {
    let r = new Wn(), s = 0;
    for (let i = e; i <= n; i++) {
      let o = this.getRow(i);
      o && (r.setRow(i, o), s += Object.keys(o).length);
    }
    return { sliceData: r, cellCount: s };
  }
  getSizeOf() {
    return Object.keys(this._matrix).length;
  }
  getLength() {
    return wn(this._matrix);
  }
  getRange() {
    let e = this.getLength() - 1, n = 0, r = this.getLength();
    for (let s = 0; s < r; s++) {
      let i = this.getRow(s);
      if (i) {
        let o = wn(i) - 1;
        n = o > n ? o : n;
      }
    }
    return { startRow: 0, startColumn: 0, endRow: e, endColumn: n };
  }
  getRealRange() {
    let e = Object.keys(this._matrix), n = e.length, r = n > 0 ? Number(e[0]) : 0, s = n > 0 ? Number(e[n - 1]) : 0, i = -1 / 0, o = 0;
    for (let a of e) {
      let l = this.getRow(Number(a));
      if (l) {
        let u = Object.keys(l);
        if (u.length > 0) {
          let c = Number(u[0]), d = Number(u[u.length - 1]);
          (i === -1 / 0 || c < i) && (i = c), d > o && (o = d);
        }
      }
    }
    return i === -1 / 0 && (i = 0), { startRow: r, endRow: s, startColumn: i, endColumn: o };
  }
  getRealRowRange() {
    let e = Object.keys(this._matrix), n = e.length;
    return { startRow: n > 0 ? Number(e[0]) : 0, endRow: n > 0 ? Number(e[n - 1]) : 0 };
  }
  toNativeArray() {
    let e = [];
    return this.forValue((n, r, s) => {
      e.push(s);
    }), e;
  }
  toArray() {
    let e = [];
    return this.forRow((n, r) => {
      e[n] == null && (e[n] = []), r.forEach((s) => {
        e[n][s] = this.getValue(n, s);
      });
    }), e;
  }
  toFullArray() {
    let { endColumn: e, endRow: n } = this.getRange(), r = [];
    for (let s = 0; s <= n; s++) {
      let i = Array(e + 1).fill(void 0);
      r.push(i);
    }
    return this.forValue((s, i, o) => {
      r[s][i] = o;
    }), r;
  }
  toJSON() {
    return this._matrix;
  }
  clone() {
    let e = JSON.stringify(this._matrix);
    return JSON.parse(e);
  }
  getData() {
    let e = JSON.stringify(this._matrix);
    return JSON.parse(e);
  }
  getArrayData() {
    let e = 0, n = 0, r = !1, s = !1, i = new Wn();
    return this.forEach((o, a) => {
      r || (r = !0, e = o), Object.keys(a).forEach((l) => {
        let u = Number(l);
        s ? u < n && (n = u) : (s = !0, n = u);
        let c = this.getValue(o, u);
        i.setValue(o - e, u - n, c);
      });
    }), i.getData();
  }
  getStartEndScope() {
    let e = 1 / 0, n = -1 / 0, r = 1 / 0, s = -1 / 0, i = Object.keys(this._matrix);
    i.length > 0 && (e = +i[0], n = +i[i.length - 1]);
    for (let o of i) {
      let a = Object.keys(this._matrix[o]);
      a.length > 0 && (r = Math.min(r, +a[0]), s = Math.max(s, +a[a.length - 1]));
    }
    return { startRow: e, endRow: n, startColumn: r, endColumn: s };
  }
  getDataRange() {
    let e = 0, n = 0, r = 0, s = -1, i = !1, o = !1;
    return this.forEach((a, l) => {
      if (i || (i = !0, e = a), l == null) return;
      let u = wn(l) - 1;
      u > r && (r = u), Object.keys(l).forEach((c) => {
        let d = Number(c);
        o ? d < n && (n = d) : (o = !0, n = d);
      }), a > s && (s = a);
    }), { startRow: e, startColumn: n, endRow: s, endColumn: r };
  }
  getDiscreteRanges() {
    let e = [];
    return this.forEach((n, r) => {
      Object.keys(r).forEach((s) => {
        let i = Number(s), o = !1;
        for (let a of e) if (n >= a.startRow && n <= a.endRow + 1 && i >= a.startColumn && i <= a.endColumn + 1) {
          a.endRow = Math.max(n, a.endRow), a.endColumn = Math.max(i, a.endColumn), o = !0;
          break;
        }
        o || e.push({ startRow: n, endRow: n, startColumn: i, endColumn: i });
      });
    }), e;
  }
  merge(e) {
    this.forValue((n, r) => {
      let s = e.getValue(n, r);
      s != null && this.setValue(n, r, s);
    });
  }
  concatRows(e) {
    let n = e.getMatrix();
    for (let r in n) {
      let s = Number(r);
      this.setRow(s, n[s]);
    }
  }
  _setOriginValue(e = {}) {
    this._matrix = e;
  }
};
function ly(t) {
  let { actualRow: e, actualColumn: n, isMerged: r, isMergedMainCell: s, mergeInfo: i } = t, { startY: o, endY: a, startX: l, endX: u } = t, c = e, d = n, h = e, f = n;
  if (r && i) {
    let { startRow: p, startColumn: g, endRow: _, endColumn: C, startY: S, endY: T, startX: w, endX: E } = i;
    c = p, d = g, h = _, f = C, o = S, a = T, l = w, u = E;
  }
  return s && (o = i.startY, a = i.endY, l = i.startX, u = i.endX, h = i.endRow, f = i.endColumn), { startRow: c, startColumn: d, endRow: h, endColumn: f, startY: o, endY: a, startX: l, endX: u };
}
const VR = ly;
function GR(t) {
  if (!t) return;
  let { actualRow: e, actualColumn: n, isMerged: r, isMergedMainCell: s, startRow: i, startColumn: o, endRow: a, endColumn: l } = t, u = e, c = n, d = e, h = n;
  return (r || s) && (u = i, c = o, d = a, h = l), { startRow: u, startColumn: c, endRow: d, endColumn: h };
}
function uy(t) {
  var e;
  return !t || ((t == null || (e = t.v) == null ? void 0 : e.toString()) || "").length === 0 && !t.p;
}
function Xl(t) {
  return uy(t) && (t == null ? void 0 : t.coverable) !== !1;
}
function rn(t) {
  if (t) {
    if (t.rgb) return new Gl(t.rgb).toHexString();
    if (t.th != null) {
      var e;
      let n = (e = ey[ad.OFFICE]) == null ? void 0 : e[t.th];
      if (n) return new Gl(n).toRgbString();
    }
  }
  return null;
}
function cy(t) {
  return j.isString(t) && t.substring(0, 1) === "=" && t.length > 1;
}
function YR(t) {
  return j.isString(t) && t.length > 0;
}
function zR(t, e = !1) {
  let n = "", r = /* @__PURE__ */ new Map([["ff", () => {
    t.ff && (n += `font-family: ${t.ff}; `);
  }], ["fs", () => {
    if (t.fs) {
      let o = t.fs;
      t.va && (o /= 2), n += `font-size: ${o}pt; `;
    }
  }], ["it", () => {
    t.it && (n += "font-style: italic; ");
  }], ["bl", () => {
    t.bl && (n += "font-weight: bold; ");
  }], ["ul", () => {
    var o;
    (o = t.ul) != null && o.s && (n.indexOf("text-decoration-line") > -1 ? n = n.replace(/(text-decoration-line:\s*[^;]+)(?=;)/g, (a, l) => `${l} underline`) : n += "text-decoration: underline; ", t.ul.cl && n.indexOf("text-decoration-color") === -1 && (n += `text-decoration-color: ${rn(t.ul.cl)}; `), t.ul.t && n.indexOf("text-decoration-style") === -1 && (n += `text-decoration-style: ${t.ul.t} `));
  }], ["st", () => {
    var o;
    (o = t.st) != null && o.s && (n.indexOf("text-decoration-line") > -1 ? n = n.replace(/(text-decoration-line:\s*[^;]+)(?=;)/g, (a, l) => `${l} line-through`) : n += "text-decoration-line: line-through; ", t.st.cl && n.indexOf("text-decoration-color") === -1 && (n += `text-decoration-color: ${rn(t.st.cl)}; `), t.st.t && n.indexOf("text-decoration-style") === -1 && (n += `text-decoration-style: ${t.st.t} `));
  }], ["ol", () => {
    var o;
    (o = t.ol) != null && o.s && (n.indexOf("text-decoration-line") > -1 ? n = n.replace(/(text-decoration-line:\s*[^;]+)(?=;)/g, (a, l) => `${l} overline`) : n += "text-decoration-line: overline; ", t.ol.cl && n.indexOf("text-decoration-color") === -1 && (n += `text-decoration-color: ${rn(t.ol.cl)}; `), t.ol.t && n.indexOf("text-decoration-style") === -1 && (n += `text-decoration-style: ${t.ol.t} `));
  }], ["bg", () => {
    t.bg && (n += `background: ${rn(t.bg)}; `);
  }], ["bd", () => {
    var o, a, l, u;
    if ((o = t.bd) != null && o.b) {
      var c, d;
      n += `border-bottom: ${os((c = t.bd) == null ? void 0 : c.b.s)} ${(d = rn(t.bd.b.cl)) == null ? "" : d}; `;
    }
    if ((a = t.bd) != null && a.t) {
      var h, f;
      n += `border-top: ${os((h = t.bd) == null ? void 0 : h.t.s)} ${(f = rn(t.bd.t.cl)) == null ? "" : f}; `;
    }
    if ((l = t.bd) != null && l.r) {
      var p, g;
      n += `border-right: ${os((p = t.bd) == null ? void 0 : p.r.s)} ${(g = rn(t.bd.r.cl)) == null ? "" : g}; `;
    }
    if ((u = t.bd) != null && u.l) {
      var _, C;
      n += `border-left: ${os((_ = t.bd) == null ? void 0 : _.l.s)} ${(C = rn(t.bd.l.cl)) == null ? "" : C}; `;
    }
  }], ["cl", () => {
    t.cl && (n += `color: ${rn(t.cl)}; `);
  }], ["va", () => {
    t.va === Dr.SUBSCRIPT ? n += "vertical-align: sub; " : t.va === Dr.SUPERSCRIPT && (n += "vertical-align: super; ");
  }], ["td", () => {
    t.td === Wi.LEFT_TO_RIGHT ? n += "direction: ltr; " : t.td === Wi.RIGHT_TO_LEFT && (n += "direction: rtl; ");
  }], ["tr", () => {
    if (t.tr) {
      var o, a, l;
      n += `--data-rotate: (${(o = t.tr) == null ? void 0 : o.a}deg${(a = t.tr) != null && a.v ? ` ,${(l = t.tr) == null ? void 0 : l.v}` : ""});`;
    }
  }], ["ht", () => {
    t.ht === sn.LEFT ? n += "text-align: left; " : t.ht === sn.RIGHT ? n += "text-align: right; " : t.ht === sn.CENTER ? n += "text-align: center; " : t.ht === sn.JUSTIFIED && (n += "text-align: justify; ");
  }], ["vt", () => {
    t.vt === Nr.BOTTOM ? n += "vertical-align: bottom; " : t.vt === Nr.TOP ? n += "vertical-align: top; " : t.vt === Nr.MIDDLE && (n += "vertical-align: middle; ");
  }], ["tb", () => {
    t.tb === Hr.CLIP ? n += "white-space: nowrap; overflow-x: hidden; " : t.tb === Hr.WRAP && (n += "white-space: normal;");
  }], ["pd", () => {
    var o, a, l, u, c, d, h, f;
    let p = `${(o = t.pd) == null ? void 0 : o.b}pt`, g = `${(a = t.pd) == null ? void 0 : a.t}pt`, _ = `${(l = t.pd) == null ? void 0 : l.l}pt`, C = `${(u = t.pd) == null ? void 0 : u.r}pt`;
    (c = t.pd) != null && c.b && (n += `padding-bottom: ${p}; `), (d = t.pd) != null && d.t && (n += `padding-top: ${g}; `), (h = t.pd) != null && h.l && (n += `padding-left: ${_}; `), (f = t.pd) != null && f.r && (n += `padding-right: ${C}; `);
  }]]), s = ["bd", "tr", "tb"];
  for (let o in t) {
    var i;
    e && s.includes(o) || (i = r.get(o)) == null || i();
  }
  return n;
}
function os(t) {
  let e = "";
  return t === Ft.NONE ? e = "none" : t === Ft.THIN ? e = "0.5pt solid" : t === Ft.HAIR ? e = "0.5pt double" : t === Ft.DOTTED ? e = "0.5pt dotted" : t === Ft.DASHED || t === Ft.DASH_DOT ? e = "0.5pt dashed" : t === Ft.DASH_DOT_DOT ? e = "0.5pt dotted" : t === Ft.DOUBLE ? e = "0.5pt double" : t === Ft.MEDIUM ? e = "1pt solid" : t === Ft.MEDIUM_DASHED || t === Ft.MEDIUM_DASH_DOT ? e = "1pt dashed" : t === Ft.MEDIUM_DASH_DOT_DOT ? e = "1pt dotted" : t === Ft.SLANT_DASH_DOT ? e = "0.5pt dashed" : t === Ft.THICK && (e = "1.5pt solid"), e;
}
function KR(t) {
  let e = 0;
  if (t = t.trim(), t === "none") e = Ft.NONE;
  else if (t === "0.5pt solid") e = Ft.THIN;
  else if (t === "0.5pt double") e = Ft.HAIR;
  else if (t === "0.5pt dotted") e = Ft.DOTTED;
  else if (t === "0.5pt dashed") e = Ft.DASHED;
  else if (t === "1pt solid") e = Ft.MEDIUM;
  else if (t === "1pt dashed") e = Ft.MEDIUM_DASHED;
  else if (t === "1pt dotted") e = Ft.MEDIUM_DASH_DOT_DOT;
  else if (t === "1.5pt solid") e = Ft.THICK;
  else if (!t.includes("none")) e = Ft.THIN;
  else return Ft.NONE;
  return e;
}
function XR(t, e) {
  let n = t.body;
  if (e) {
    let { headers: r, footers: s } = t;
    r != null && r[e] ? n = r[e].body : s != null && s[e] && (n = s[e].body);
  }
  return n;
}
function QR(t, e) {
  let { startRow: n, endRow: r, startColumn: s, endColumn: i, rangeType: o } = t;
  if (n < 0 || s < 0 || r < 0 || i < 0 || !(Number.isNaN(n) && Number.isNaN(r)) && o === at.COLUMN || !(Number.isNaN(s) && Number.isNaN(i)) && o === at.ROW || o !== at.ROW && o !== at.COLUMN && (Number.isNaN(s) || Number.isNaN(n) || Number.isNaN(i) || Number.isNaN(r))) return !1;
  if (e) {
    let a = e.getRowCount(), l = e.getColumnCount();
    if (r >= a || i >= l) return !1;
  }
  return !0;
}
function JR(t, e) {
  return { startRow: t, endRow: t, startColumn: e, endColumn: e };
}
function Ql(t) {
  if (cy(t)) return { f: t, v: null, p: null };
  if (ty(t)) {
    if (typeof t == "string") {
      let e = iy(t);
      if (e && e.z) return { v: e.v, p: null, f: null, s: { n: { pattern: e.z || "General" } } };
    }
    return { v: t, p: null, f: null };
  }
  return q_(t), t;
}
function ZR(t, e) {
  let n = new An(), { startRow: r, startColumn: s, endRow: i, endColumn: o } = e;
  if (j.isArray(t)) for (let a = 0; a <= i - r; a++) for (let l = 0; l <= o - s; l++) n.setValue(a + r, l + s, Ql(t[a][l]));
  else new An(t).forValue((a, l, u) => {
    n.setValue(a, l, Ql(u));
  });
  return n.getMatrix();
}
function ud(t, e) {
  return Object.prototype.toString.call(t) === Object.prototype.toString.call(e) ? Object.prototype.toString.call(t) === "[object Object]" || Object.prototype.toString.call(t) === "[object Array]" ? Object.keys(t).length === Object.keys(e).length ? Object.keys(t).every((n) => ud(t[n], e[n])) : !1 : t === e : !1;
}
function dy(t, e) {
  let n = t.ts || {}, r = e.ts || {};
  return t.sId === e.sId ? ud(n, r) : !1;
}
function qR(t, e) {
  return e.some((n) => t.indexOf(n) > -1);
}
hn.extend(R0), hn.extend(v0), hn.extend(N0), hn.extend(I0), hn.extend(M0), hn.extend(x0), hn.extend(O0), hn.extend(S0);
function Oa(t, e, n, r) {
  if (t > e) throw Error("a1 should be less than a2");
  if (n > r) throw Error("b1 should be less than b2");
  if (e < n || r < t) return [t, e];
  if (n <= t && r >= e) return [];
  let s = r - n + 1;
  return t < n && e > r ? [t, e - s] : n <= t && r < e ? [r + 1 - s, e - s] : n > t && r >= e ? [t, n - 1] : [t, e];
}
function t1(t) {
  if (t == null) return !1;
  let e = t.bullet;
  return (e == null ? void 0 : e.listId) != null;
}
function e1(t) {
  if (t == null) return !1;
  let e = t.paragraphStyle;
  return hy(e);
}
function hy(t) {
  var e;
  return !(t == null || (t.indentStart == null || t.indentStart.v === 0) && t.hanging == null || ((e = t.hanging) == null ? void 0 : e.v) === 0);
}
function fy(t, e, n) {
  return t.slice(0, e) + n + t.slice(e);
}
function py(t, e, n) {
  return e > n ? t : t.slice(0, e) + t.slice(n);
}
function n1(t) {
  if (t == null || typeof t == "boolean") return !1;
  if (typeof t == "number") return !isNaN(t);
  if (typeof t == "string") {
    let e = t.trim();
    return e === "" ? !1 : !isNaN(Number(e));
  }
  return !1;
}
function r1(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) e = t.charCodeAt(n) + (e << 6) + (e << 16) - e;
  return e >>> 0;
}
function s1(t) {
  if (t.length === 0) return [];
  let e = t.slice().sort((i, o) => (Array.isArray(i) ? i[0] : i) - (Array.isArray(o) ? o[0] : o)), n = [], r = Array.isArray(e[0]) ? e[0][0] : e[0], s = r;
  for (let i = 1; i < e.length; i++) {
    let o = e[i], a, l;
    Array.isArray(o) ? (a = o[0], l = o[1]) : (a = o, l = o), a <= s + 1 ? s = Math.max(s, l) : (n.push([r, s]), r = a, s = l);
  }
  return n.push([r, s]), n;
}
function i1(t) {
  if (t.length === 0) return [];
  let e = t.slice().sort((i, o) => i[0] - o[0]), n = [], [r, s] = e[0];
  for (let i = 1; i < e.length; i++) {
    let [o, a] = e[i];
    o <= s + 1 ? s = Math.max(s, a) : (n.push([r, s]), r = o, s = a);
  }
  return n.push([r, s]), n;
}
function o1(...t) {
  let e;
  return e = t.length === 1 && Array.isArray(t[0]) ? t[0] : t, So({}, ...e);
}
let cd, dd, hd, fd;
const St = Symbol("newer"), te = Symbol("older");
cd = Symbol.iterator;
var gy = class {
  constructor(t) {
    y(this, "entry", void 0), this.entry = t;
  }
  [cd]() {
    return this;
  }
  next() {
    let t = this.entry;
    return t ? (this.entry = t[St], { done: !1, value: t.key }) : { done: !0, value: void 0 };
  }
};
dd = Symbol.iterator;
var my = class {
  constructor(t) {
    y(this, "entry", void 0), this.entry = t;
  }
  [dd]() {
    return this;
  }
  next() {
    let t = this.entry;
    return t ? (this.entry = t[St], { done: !1, value: t.value }) : { done: !0, value: void 0 };
  }
};
hd = Symbol.iterator;
var _y = class {
  constructor(t) {
    y(this, "entry", void 0), this.entry = t;
  }
  [hd]() {
    return this;
  }
  next() {
    let t = this.entry;
    return t ? (this.entry = t[St], { done: !1, value: [t.key, t.value] }) : { done: !0, value: void 0 };
  }
}, Jl = class {
  constructor(t, e) {
    y(this, "key", void 0), y(this, "value", void 0), y(this, St, void 0), y(this, te, void 0), this.key = t, this.value = e, this[St] = void 0, this[te] = void 0;
  }
  toJSON() {
    return { key: this.key, value: this.value };
  }
};
fd = Symbol.iterator;
var Aa = class {
  onShift(t) {
    if (this._onShiftListeners.indexOf(t) === -1) return this._onShiftListeners.push(t), Gt(() => Xs(this._onShiftListeners, t));
    throw Error("[LRUMap]: the listener has been registered!");
  }
  constructor(...t) {
    if (y(this, "_keymap", void 0), y(this, "size", 0), y(this, "limit", void 0), y(this, "oldest", void 0), y(this, "newest", void 0), y(this, "_onShiftListeners", []), as.hasLength(t, 1)) {
      if (as.isNumber(t[0])) {
        let e = t[0];
        this._initialize(e, void 0);
        return;
      }
      if (as.isIterable(t[0])) {
        let e = t[0];
        this._initialize(0, e);
        return;
      }
      return;
    }
    if (as.hasLength(t, 2)) {
      let e = t[0], n = t[1];
      this._initialize(e, n);
    }
  }
  _initialize(t, e) {
    this.oldest = void 0, this.newest = void 0, this.size = 0, this.limit = t, this._keymap = /* @__PURE__ */ new Map(), e && (this.assign(e), t < 1 && (this.limit = this.size));
  }
  _markEntryAsUsed(t) {
    t !== this.newest && (t[St] && (t === this.oldest && (this.oldest = t[St]), t[St][te] = t[te]), t[te] && (t[te][St] = t[St]), t[St] = void 0, t[te] = this.newest, this.newest && (this.newest[St] = t), this.newest = t);
  }
  assign(t) {
    let e, n = this.limit || Number.MAX_VALUE;
    this._keymap.clear();
    let r = t[Symbol.iterator]();
    for (let s = r.next(); !s.done; s = r.next()) {
      let i = new Jl(s.value[0], s.value[1]);
      if (this._keymap.set(i.key, i), e ? (e[St] = i, i[te] = e) : this.oldest = i, e = i, n-- === 0) throw Error("overflow");
    }
    this.newest = e, this.size = this._keymap.size;
  }
  set(t, e) {
    let n = this._keymap.get(t);
    return n ? (n.value = e, this._markEntryAsUsed(n), this) : (this._keymap.set(t, n = new Jl(t, e)), this.newest ? (this.newest[St] = n, n[te] = this.newest) : this.oldest = n, this.newest = n, ++this.size, this.size > this.limit && this.shift(), this);
  }
  shift() {
    let t = this.oldest;
    if (t) return this.oldest && this.oldest[St] ? (this.oldest = this.oldest[St], this.oldest[te] = void 0) : (this.oldest = void 0, this.newest = void 0), t[St] = t[te] = void 0, this._keymap.delete(t.key), --this.size, this._onShiftListeners.forEach((e) => e(t)), [t.key, t.value];
  }
  get(t) {
    let e = this._keymap.get(t);
    if (e) return this._markEntryAsUsed(e), e.value;
  }
  has(t) {
    return this._keymap.has(t);
  }
  find(t) {
    let e = this._keymap.get(t);
    return e ? e.value : void 0;
  }
  delete(t) {
    let e = this._keymap.get(t);
    if (e) return this._keymap.delete(e.key), e[St] && e[te] ? (e[te][St] = e[St], e[St][te] = e[te]) : e[St] ? (e[St][te] = void 0, this.oldest = e[St]) : e[te] ? (e[te][St] = void 0, this.newest = e[te]) : this.oldest = this.newest = void 0, this.size--, e.value;
  }
  clear() {
    this.oldest = void 0, this.newest = void 0, this.size = 0, this._keymap.clear();
  }
  keys() {
    return new gy(this.oldest);
  }
  values() {
    return new my(this.oldest);
  }
  entries() {
    return this[Symbol.iterator]();
  }
  [fd]() {
    return new _y(this.oldest);
  }
  forEach(t, e) {
    typeof e != "object" && (e = this);
    let n = this.oldest;
    for (; n; ) t.call(e, n.value, n.key, this), n = n[St];
  }
  toJSON() {
    let t = Array(this.size), e = 0, n = this.oldest;
    for (; n; ) t[e++] = { key: n.key, value: n.value }, n = n[St];
    return t;
  }
  toString() {
    let t = "", e = this.oldest;
    for (; e; ) t += `${String(e.key)}:${e.value}`, e = e[St], e && (t += " < ");
    return t;
  }
}, as = class {
  static hasLength(t, e) {
    return t.length === e;
  }
  static getValueType(t) {
    return Object.prototype.toString.apply(t);
  }
  static isObject(t) {
    return this.getValueType(t) === "[object Object]";
  }
  static isIterable(t) {
    return t[Symbol.iterator] != null;
  }
  static isNumber(t) {
    return this.getValueType(t) === "[object Number]";
  }
};
function a1(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    let r = t.charCodeAt(n);
    if (r < 65 || r > 90) return -1;
    e = e * 26 + (r - 64);
  }
  return e;
}
const Zl = 1048576, ql = 16384, l1 = { sheetId: "", range: { startRow: -1, endRow: -1, startColumn: -1, endColumn: -1 } }, u1 = { startRow: -1, startColumn: -1, endRow: -1, endColumn: -1 }, c1 = { startRow: 0, startColumn: 0, endRow: 0, endColumn: 0 }, d1 = { row: 0, column: 0 }, pe = { ff: "Arial", fs: 11, it: z.FALSE, bl: z.FALSE, ul: { s: z.FALSE }, st: { s: z.FALSE }, ol: { s: z.FALSE }, tr: { a: 0, v: z.FALSE }, td: Wi.UNSPECIFIED, cl: { rgb: "#000000" }, bg: { rgb: "#fff" }, ht: sn.UNSPECIFIED, vt: Nr.UNSPECIFIED, tb: Hr.UNSPECIFIED, pd: { t: 0, r: 0, b: 0, l: 0 }, n: null, bd: { b: null, l: null, r: null, t: null } }, yy = { id: "default_slide", title: "defaultSlide", pageSize: { width: 300, height: 300 } }, h1 = [Zc, r_, qc], f1 = { [se.HEADING_1]: { fs: 20, bl: 1 }, [se.HEADING_2]: { fs: 18, bl: 1 }, [se.HEADING_3]: { fs: 16, bl: 1 }, [se.HEADING_4]: { fs: 14, bl: 1 }, [se.HEADING_5]: { fs: 12, bl: 1 }, [se.NORMAL_TEXT]: null, [se.TITLE]: { fs: 26, bl: 1 }, [se.SUBTITLE]: { fs: 15, cl: { rgb: "#999999" } }, [se.NAMED_STYLE_TYPE_UNSPECIFIED]: null }, p1 = { [se.HEADING_1]: { spaceAbove: { v: 20 }, spaceBelow: { v: 10 } }, [se.HEADING_2]: { spaceAbove: { v: 18 }, spaceBelow: { v: 10 } }, [se.HEADING_3]: { spaceAbove: { v: 16 }, spaceBelow: { v: 10 } }, [se.HEADING_4]: { spaceAbove: { v: 14 }, spaceBelow: { v: 8 } }, [se.HEADING_5]: { spaceAbove: { v: 12 }, spaceBelow: { v: 8 } }, [se.NORMAL_TEXT]: { spaceAbove: { v: 0 }, spaceBelow: { v: 0 } }, [se.TITLE]: { spaceAbove: { v: 0 }, spaceBelow: { v: 7 } }, [se.SUBTITLE]: { spaceAbove: { v: 0 }, spaceBelow: { v: 16 } }, [se.NAMED_STYLE_TYPE_UNSPECIFIED]: null }, g1 = "univer-sheets-chart-print-chart", m1 = "univer-docs-drawing-printing";
let _1 = function(t) {
  return t.ARRAY_CONVERTOR = "ARRAY_CONVERTOR", t.MATRIX_CONVERTOR = "MATRIX_CONVERTOR", t;
}({});
const y1 = { [Wt.A3]: { width: 1123, height: 1587 }, [Wt.A4]: { width: 794, height: 1124 }, [Wt.A5]: { width: 559, height: 794 }, [Wt.B4]: { width: 944, height: 1344 }, [Wt.B5]: { width: 665, height: 944 }, [Wt.Executive]: { width: 696, height: 1008 }, [Wt.Folio]: { width: 816, height: 1248 }, [Wt.Legal]: { width: 816, height: 1344 }, [Wt.Letter]: { width: 816, height: 1056 }, [Wt.Statement]: { width: 528, height: 816 }, [Wt.Tabloid]: { width: 1056, height: 1632 } };
function ls(t, e) {
  let { textRuns: n = [] } = e, r = 0;
  for (let s of n) {
    let { ts: i = {}, st: o, ed: a } = s;
    if (i[t] == null) return z.FALSE;
    switch (t) {
      case "bl":
      case "it":
        if (i[t] === z.FALSE) return z.FALSE;
        break;
      case "ul":
      case "st":
        if (i[t].s === z.FALSE) return z.FALSE;
        break;
      default:
        throw Error(`unknown style key: ${t} in IStyleBase`);
    }
    r += a - o;
  }
  return e.dataStream.indexOf(`\r
`) === r ? z.TRUE : z.FALSE;
}
var Ls = class Gi {
  constructor(e, n, r) {
    this._deps = r, y(this, "_range", void 0), y(this, "_worksheet", void 0), this._range = n, this._worksheet = e;
  }
  static foreach(e, n) {
    let { startRow: r, startColumn: s, endRow: i, endColumn: o } = e;
    for (let a = r; a <= i; a++) for (let l = s; l <= o; l++) n(a, l);
  }
  getRangeData() {
    return this._range;
  }
  getValue() {
    return this.getValues()[0][0];
  }
  getValues() {
    let { startRow: e, endRow: n, startColumn: r, endColumn: s } = this._range, i = [];
    for (let o = e; o <= n; o++) {
      let a = [];
      for (let l = r; l <= s; l++) a.push(this.getMatrix().getValue(o, l) || null);
      i.push(a);
    }
    return i;
  }
  getMatrix() {
    let { startRow: e, endRow: n, startColumn: r, endColumn: s } = this._range, i = this._worksheet.getCellMatrix(), o = new An();
    for (let a = e; a <= n; a++) for (let l = r; l <= s; l++) o.setValue(a, l, i.getValue(a, l) || null);
    return o;
  }
  getMatrixObject() {
    let { startRow: e, endRow: n, startColumn: r, endColumn: s } = this._range, i = this._worksheet.getCellMatrix(), o = new An();
    for (let a = e; a <= n; a++) for (let l = r; l <= s; l++) o.setValue(a - e, l - r, i.getValue(a, l) || {});
    return o;
  }
  getA1Notation() {
    let { startRow: e, endRow: n, startColumn: r, endColumn: s } = this._range, i, o;
    return r < s ? (i = j.numToWord(r + 1) + (e + 1), o = j.numToWord(s + 1) + (n + 1)) : (i = j.numToWord(s + 1) + (n + 1), o = j.numToWord(r + 1) + (e + 1)), i === o ? `${i}` : `${i}:${o}`;
  }
  getBackground() {
    return this.getBackgrounds()[0][0];
  }
  getBackgrounds() {
    let e = this._deps.getStyles();
    return this.getValues().map((n) => n.map((r) => {
      var s;
      let i = e.getStyleByCell(r);
      return (i == null || (s = i.bg) == null ? void 0 : s.rgb) || pe.bg.rgb;
    }));
  }
  getCell(e, n) {
    let { startRow: r, startColumn: s } = this._range, i = { startRow: r + e, endRow: r + e, startColumn: s + n, endColumn: s + n };
    return new Gi(this._worksheet, i, this._deps);
  }
  getColumn() {
    return this._range.startColumn;
  }
  getObjectValue(e = {}) {
    return this.getObjectValues(e)[0][0];
  }
  getObjectValues(e = {}) {
    let { startRow: n, endRow: r, startColumn: s, endColumn: i } = this._range, o = this._worksheet.getCellMatrix().getFragment(n, r, s, i).getData();
    if (e.isIncludeStyle) {
      let l = this._deps.getStyles();
      for (let u = 0; u <= r - n; u++) for (let c = 0; c <= i - s; c++) {
        var a;
        if (o == null || (o == null || (a = o[u]) == null ? void 0 : a[c]) == null) continue;
        let d = o[u][c].s;
        d && (o[u][c].s = l.get(d));
      }
    }
    return o;
  }
  getFontColor() {
    return this.getFontColors()[0][0];
  }
  getFontColors() {
    let e = this._deps.getStyles();
    return this.getValues().map((n) => n.map((r) => {
      var s;
      let i = e.getStyleByCell(r);
      return (i == null || (s = i.cl) == null ? void 0 : s.rgb) || pe.cl.rgb;
    }));
  }
  getFontFamilies() {
    return this._getStyles("ff");
  }
  getFontFamily() {
    return this.getFontFamilies()[0][0];
  }
  getUnderlines() {
    return this._getStyles("ul");
  }
  getUnderline() {
    var e, n;
    let { p: r } = (e = this.getValue()) == null ? {} : e;
    return r && Array.isArray((n = r.body) == null ? void 0 : n.textRuns) && r.body.textRuns.length > 0 ? ls("ul", r.body) === z.TRUE ? { s: z.TRUE } : { s: z.FALSE } : this.getUnderlines()[0][0];
  }
  getOverlines() {
    return this._getStyles("ol");
  }
  getOverline() {
    return this.getOverlines()[0][0];
  }
  getStrikeThrough() {
    var e, n;
    let { p: r } = (e = this.getValue()) == null ? {} : e;
    return r && Array.isArray((n = r.body) == null ? void 0 : n.textRuns) && r.body.textRuns.length > 0 ? ls("st", r.body) === z.TRUE ? { s: z.TRUE } : { s: z.FALSE } : this.getStrikeThroughs()[0][0];
  }
  getStrikeThroughs() {
    return this._getStyles("st");
  }
  getFontSize() {
    var e, n;
    let r = ((e = this.getValue()) == null ? void 0 : e.p) || {};
    return r && Array.isArray((n = r.body) == null ? void 0 : n.textRuns) && r.body.textRuns.length > 0 && r.body.textRuns.some((s) => {
      var i;
      return (s == null || (i = s.ts) == null ? void 0 : i.fs) != null;
    }) ? Math.max(...r.body.textRuns.map((s) => {
      var i;
      return (s == null || (i = s.ts) == null ? void 0 : i.fs) || 0;
    })) : this.getFontSizes()[0][0];
  }
  getFontSizes() {
    return this._getStyles("fs");
  }
  getBorder() {
    return this.getBorders()[0][0];
  }
  getBorders() {
    return this._getStyles("bd");
  }
  getFontStyle() {
    var e, n;
    let { p: r } = (e = this.getValue()) == null ? {} : e;
    return r && Array.isArray((n = r.body) == null ? void 0 : n.textRuns) && r.body.textRuns.length > 0 ? ls("it", r.body) === z.TRUE ? jl.ITALIC : jl.NORMAL : this._getFontStyles()[0][0];
  }
  _getFontStyles() {
    return this._getStyles("it");
  }
  getFontWeight() {
    var e, n;
    let { p: r } = (e = this.getValue()) == null ? {} : e;
    return r && Array.isArray((n = r.body) == null ? void 0 : n.textRuns) && r.body.textRuns.length > 0 ? ls("bl", r.body) === z.TRUE ? $l.BOLD : $l.NORMAL : this._getFontWeights()[0][0];
  }
  _getFontWeights() {
    return this._getStyles("bl");
  }
  getGridId() {
    return this._worksheet.getSheetId();
  }
  getHeight() {
    let { _range: e, _worksheet: n } = this, { startRow: r, endRow: s } = e, i = 0;
    for (let o = 0; o <= s - r; o++) {
      let a = n.getRowHeight(o);
      i += a;
    }
    return i;
  }
  getHorizontalAlignment() {
    return this.getHorizontalAlignments()[0][0];
  }
  getHorizontalAlignments() {
    return this._getStyles("ht");
  }
  getLastColumn() {
    return this._range.endColumn;
  }
  getLastRow() {
    return this._range.endRow;
  }
  getNumColumns() {
    let { startColumn: e, endColumn: n } = this._range;
    return n - e + 1;
  }
  getNumRows() {
    let { startRow: e, endRow: n } = this._range;
    return n - e + 1;
  }
  getRichTextValue() {
    return this.getRichTextValues()[0][0];
  }
  getRichTextValues() {
    return this.getValues().map((e) => e.map((n) => (n == null ? void 0 : n.p) || ""));
  }
  getRowIndex() {
    return this._range.startRow;
  }
  getSheet() {
    return this._worksheet;
  }
  getTextDirection() {
    return this.getTextDirections()[0][0];
  }
  getTextDirections() {
    return this._getStyles("td");
  }
  getTextRotation() {
    return this.getTextRotations()[0][0];
  }
  getTextRotations() {
    return this._getStyles("tr");
  }
  getTextStyle() {
    return this.getTextStyles()[0][0];
  }
  getTextStyles() {
    let e = this._deps.getStyles();
    return this.getValues().map((n) => n.map((r) => e.getStyleByCell(r)));
  }
  getVerticalAlignment() {
    return this.getVerticalAlignments()[0][0];
  }
  getVerticalAlignments() {
    return this._getStyles("vt");
  }
  getWidth() {
    let { _range: e, _worksheet: n } = this, { startColumn: r, endColumn: s } = e, i = 0;
    for (let o = 0; o <= s - r; o++) i += n.getColumnWidth(o);
    return i;
  }
  getWrap() {
    return this.getWrapStrategy() === Hr.WRAP ? z.TRUE : z.FALSE;
  }
  getWrapStrategies() {
    return this._getStyles("tb");
  }
  getWrapStrategy() {
    return this.getWrapStrategies()[0][0];
  }
  forEach(e) {
    Gi.foreach(this._range, e);
  }
  _getStyles(e) {
    let n = this._deps.getStyles();
    return this.getValues().map((r) => r.map((s) => {
      let i = n && n.getStyleByCell(s);
      return i && i[e] || pe[e];
    }));
  }
};
y(Ls, "transformRange", (t, e) => {
  let n = e.getMaxColumns() - 1, r = e.getMaxRows() - 1;
  return t.rangeType === at.ALL ? { startColumn: 0, startRow: 0, endColumn: n, endRow: r } : t.rangeType === at.COLUMN ? { startRow: 0, endRow: r, startColumn: t.startColumn, endColumn: t.endColumn } : t.rangeType === at.ROW ? { startColumn: 0, endColumn: n, startRow: t.startRow, endRow: t.endRow } : { startColumn: t.startColumn, endColumn: Math.min(t.endColumn, n), startRow: t.startRow, endRow: Math.min(t.endRow, r) };
});
function E1(t, e, n, r = !1) {
  if (e === 0 && n === 0) return t;
  let s = { ...t }, i = s.startAbsoluteRefType || wt.NONE, o = s.endAbsoluteRefType || wt.NONE, a = s.rangeType || at.NORMAL;
  if (!r && i === wt.ALL && o === wt.ALL) return s;
  let l = tu(s.startRow, n, s.startColumn, e, a), u = tu(s.endRow, n, s.endColumn, e, a);
  return r || i === wt.NONE && o === wt.NONE ? s = { ...s, startRow: l.row, startColumn: l.column, endRow: u.row, endColumn: u.column } : (i === wt.NONE ? s = { ...s, startRow: l.row, startColumn: l.column } : i === wt.COLUMN ? s = { ...s, startRow: l.row } : i === wt.ROW && (s = { ...s, startColumn: l.column }), o === wt.NONE ? s = { ...s, endRow: u.row, endColumn: u.column } : o === wt.COLUMN ? s = { ...s, endRow: u.row } : o === wt.ROW && (s = { ...s, endColumn: u.column }), s);
}
function tu(t, e, n, r, s) {
  return s === at.NORMAL ? { row: t + e, column: n + r } : s === at.ROW ? { row: t + e, column: n } : s === at.COLUMN ? { row: t, column: n + r } : { row: t, column: n };
}
function pd(t) {
  let e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
  for (let o of t) e.add(o.startColumn), e.add(o.endColumn + 1), n.add(o.startRow), n.add(o.endRow + 1);
  let r = Array.from(e).sort((o, a) => o - a), s = Array.from(n).sort((o, a) => o - a);
  t.sort((o, a) => o.startRow - a.startRow || o.startColumn - a.startColumn);
  let i = [];
  for (let o = 0; o < s.length - 1; o++) for (let a = 0; a < r.length - 1; a++) {
    let l = r[a], u = r[a + 1] - 1, c = s[o], d = s[o + 1] - 1;
    for (let h of t) {
      if (h.startRow > d) break;
      if (h.startRow <= c && h.endRow >= d && h.startColumn <= l && h.endColumn >= u) {
        i.push({ startColumn: l, endColumn: u, startRow: c, endRow: d });
        break;
      }
    }
  }
  return i;
}
function Ey(t) {
  t.sort((r, s) => r.startRow - s.startRow || r.startColumn - s.startColumn);
  let e = {};
  for (let r of t) e[r.startRow] || (e[r.startRow] = []), e[r.startRow].push(r);
  let n = [];
  for (let r in e) {
    let s = e[+r];
    s.sort((o, a) => o.startColumn - a.startColumn);
    let i = s[0];
    for (let o = 1; o < s.length; o++) {
      let a = s[o];
      a.startColumn <= i.endColumn + 1 && a.startRow === i.startRow && a.endRow === i.endRow ? i.endColumn = Math.max(i.endColumn, a.endColumn) : (n.push(i), i = a);
    }
    n.push(i);
  }
  return n;
}
function vy(t) {
  t.sort((r, s) => r.startColumn - s.startColumn || r.startRow - s.startRow);
  let e = {};
  for (let r of t) e[r.startColumn] || (e[r.startColumn] = []), e[r.startColumn].push(r);
  let n = [];
  for (let r in e) {
    let s = e[+r];
    s.sort((o, a) => o.startRow - a.startRow);
    let i = s[0];
    for (let o = 1; o < s.length; o++) {
      let a = s[o];
      a.startRow <= i.endRow + 1 && a.startColumn === i.startColumn && a.endColumn === i.endColumn ? i.endRow = Math.max(i.endRow, a.endRow) : (n.push(i), i = a);
    }
    n.push(i);
  }
  return n;
}
function Cy(t) {
  return vy(Ey(pd(t)));
}
function Ry(t, e) {
  let n = [];
  return t.forEach((r) => {
    n.push(...je.subtract(r, e));
  }), je.mergeRanges(n);
}
function by(t, e) {
  let n = eu(t.startRow, t.endRow, e.startRow, e.endRow), r = eu(t.startColumn, t.endColumn, e.startColumn, e.endColumn);
  if (!n || !r) return null;
  let [s, i] = n, [o, a] = r;
  return { startRow: s, endRow: i, startColumn: o, endColumn: a, rangeType: Iy(t.rangeType, e.rangeType, s, i, o, a) };
}
function eu(t, e, n, r) {
  let s = isNaN(t) ? -1 / 0 : t, i = isNaN(e) ? 1 / 0 : e, o = isNaN(n) ? -1 / 0 : n, a = isNaN(r) ? 1 / 0 : r, l = Math.max(s, o), u = Math.min(i, a);
  return l <= u ? [l === -1 / 0 ? NaN : l, u === 1 / 0 ? NaN : u] : null;
}
function Iy(t, e, n, r, s, i) {
  let o = t === void 0 ? nu(n, r, s, i) : t, a = e === void 0 ? nu(n, r, s, i) : e;
  return o === at.ALL || a === at.ALL ? o === a ? o : o === at.ALL ? a : o : o === a ? o : (o === at.NORMAL || at.NORMAL, at.NORMAL);
}
function nu(t, e, n, r) {
  let s = !isNaN(t) && !isNaN(e), i = !isNaN(n) && !isNaN(r);
  return s && i ? at.NORMAL : s ? at.ROW : i ? at.COLUMN : at.ALL;
}
var je = class Yi {
  static clone(e) {
    return e.rangeType === void 0 ? { startRow: e.startRow, startColumn: e.startColumn, endRow: e.endRow, endColumn: e.endColumn } : { startRow: e.startRow, startColumn: e.startColumn, endRow: e.endRow, endColumn: e.endColumn, rangeType: e.rangeType };
  }
  static equals(e, n) {
    return e == null || n == null ? !1 : e.endRow === n.endRow && e.endColumn === n.endColumn && e.startRow === n.startRow && e.startColumn === n.startColumn && (e.rangeType === n.rangeType || e.rangeType === void 0 && n.rangeType === at.NORMAL || n.rangeType === void 0 && e.rangeType === at.NORMAL);
  }
  static simpleRangesIntersect(e, n) {
    let { startRow: r, endRow: s, startColumn: i, endColumn: o } = e, { startRow: a, endRow: l, startColumn: u, endColumn: c } = n;
    return r <= l && s >= a && i <= c && o >= u;
  }
  static intersects(e, n) {
    if (e.rangeType === at.ROW && n.rangeType === at.COLUMN || e.rangeType === at.COLUMN && n.rangeType === at.ROW) return !0;
    if (e.rangeType === at.ROW && n.rangeType === at.ROW) return e.startRow <= n.endRow && e.endRow >= n.startRow;
    if (e.rangeType === at.COLUMN && n.rangeType === at.COLUMN) return e.startColumn <= n.endColumn && e.endColumn >= n.startColumn;
    let r = Number.isNaN(e.startRow) ? 0 : e.startRow, s = Number.isNaN(e.endRow) ? Zl - 1 : e.endRow, i = Number.isNaN(e.startColumn) ? 0 : e.startColumn, o = Number.isNaN(e.endColumn) ? ql - 1 : e.endColumn, a = Number.isNaN(n.startRow) ? 0 : n.startRow, l = Number.isNaN(n.endRow) ? Zl - 1 : n.endRow, u = Number.isNaN(n.startColumn) ? 0 : n.startColumn, c = Number.isNaN(n.endColumn) ? ql - 1 : n.endColumn, d = Math.abs(i + o - u - c), h = Math.abs(i - o) + Math.abs(u - c), f = Math.abs(r + s - a - l), p = Math.abs(r - s) + Math.abs(a - l);
    return d <= h && f <= p;
  }
  static doAnyRangesIntersect(e, n) {
    let r = new Hi();
    return r.load(e.map((s) => ({ minX: s.startColumn, minY: s.startRow, maxX: s.endColumn, maxY: s.endRow }))), n.some((s) => r.search({ minX: s.startColumn, minY: s.startRow, maxX: s.endColumn, maxY: s.endRow }).length > 0);
  }
  static getIntersects(e, n) {
    let r = e.startRow, s = e.endRow, i = e.startColumn, o = e.endColumn, a = n.startRow, l = n.endRow, u = n.startColumn, c = n.endColumn, d, h, f, p;
    if (a <= s) h = a >= r ? a : r;
    else return null;
    if (l >= r) p = l >= s ? s : l;
    else return null;
    if (u <= o) d = u > i ? u : i;
    else return null;
    if (c >= i) f = c >= o ? o : c;
    else return null;
    return { startRow: h, endRow: p, startColumn: d, endColumn: f, rangeType: at.NORMAL };
  }
  static contains(e, n) {
    return e.startRow <= n.startRow && e.endRow >= n.endRow && e.startColumn <= n.startColumn && e.endColumn >= n.endColumn;
  }
  static realContain(e, n) {
    return Yi.contains(e, n) && (e.startRow < n.startRow || e.endRow > n.endRow || e.startColumn < n.startColumn || e.endColumn > n.endColumn);
  }
  static union(...e) {
    return e.reduce((n, r) => ({ startRow: Math.min(n.startRow, r.startRow), startColumn: Math.min(n.startColumn, r.startColumn), endRow: Math.max(n.endRow, r.endRow), endColumn: Math.max(n.endColumn, r.endColumn), rangeType: at.NORMAL }), e[0]);
  }
  static realUnion(...e) {
    let n = e.some((i) => i.rangeType === at.COLUMN), r = e.some((i) => i.rangeType === at.ROW), s = Yi.union(...e);
    return { startColumn: r ? NaN : s.startColumn, endColumn: r ? NaN : s.endColumn, startRow: n ? NaN : s.startRow, endRow: n ? NaN : s.endRow, rangeType: r ? at.ROW : n ? at.COLUMN : at.NORMAL };
  }
  static subtract(e, n) {
    if (n.startRow > e.endRow || n.endRow < e.startRow || n.startColumn > e.endColumn || n.endColumn < e.startColumn) return [e];
    let r = [];
    n.startRow >= e.startRow && r.push({ startRow: e.startRow, startColumn: e.startColumn, endRow: n.startRow - 1, endColumn: e.endColumn }), n.endRow <= e.endRow && r.push({ startRow: n.endRow + 1, startColumn: e.startColumn, endRow: e.endRow, endColumn: e.endColumn });
    let s = Math.max(e.startRow, n.startRow), i = Math.min(e.endRow, n.endRow);
    return n.startColumn >= e.startColumn && r.push({ startRow: s, startColumn: e.startColumn, endRow: i, endColumn: n.startColumn - 1 }), n.endColumn <= e.endColumn && r.push({ startRow: s, startColumn: n.endColumn + 1, endRow: i, endColumn: e.endColumn }), r.filter((o) => o.startRow <= o.endRow && o.startColumn <= o.endColumn);
  }
  static mergeRanges(e) {
    return Cy(e);
  }
  static splitIntoGrid(e) {
    return pd(e);
  }
  static subtractMulti(e, n) {
    if (!n.length) return e;
    let r = e;
    return n.forEach((s) => {
      r = Ry(r, s);
    }), r;
  }
  static hasIntersectionBetweenTwoRect(e, n) {
    return !(e.left > n.right || e.right < n.left || e.top > n.bottom || e.bottom < n.top);
  }
  static getIntersectionBetweenTwoRect(e, n) {
    let r = Math.max(e.left, n.left), s = Math.min(e.right, n.right), i = Math.max(e.top, n.top), o = Math.min(e.bottom, n.bottom);
    return s <= r || o <= i ? null : { left: r, right: s, top: i, bottom: o, width: s - r, height: o - i };
  }
  static sort(e) {
    return e.sort((n, r) => n.startRow - r.startRow || n.startColumn - r.startColumn);
  }
};
y(je, "getRelativeRange", (t, e) => ({ startRow: t.startRow - e.startRow, endRow: t.endRow - t.startRow, startColumn: t.startColumn - e.startColumn, endColumn: t.endColumn - t.startColumn })), y(je, "getPositionRange", (t, e, n) => ({ ...n || {}, startRow: n && [wt.ROW, wt.ALL].includes(n.startAbsoluteRefType || 0) ? n.startRow : t.startRow + e.startRow, endRow: n && [wt.ROW, wt.ALL].includes(n.endAbsoluteRefType || 0) ? n.endRow : t.endRow + t.startRow + e.startRow, startColumn: n && [wt.COLUMN, wt.ALL].includes(n.startAbsoluteRefType || 0) ? n.startColumn : t.startColumn + e.startColumn, endColumn: n && [wt.COLUMN, wt.ALL].includes(n.endAbsoluteRefType || 0) ? n.endColumn : t.endColumn + t.startColumn + e.startColumn })), y(je, "moveHorizontal", (t, e = 0, n = 0) => ({ ...t, startColumn: t.startColumn + e, endColumn: t.endColumn + e + n })), y(je, "moveVertical", (t, e = 0, n = 0) => ({ ...t, startRow: t.startRow + e, endRow: t.endRow + e + n })), y(je, "moveOffset", (t, e, n) => {
  let r = { ...t };
  switch (t.startAbsoluteRefType) {
    case wt.ROW:
      r.startColumn += e;
      break;
    case wt.COLUMN:
      r.startRow += n;
      break;
    case wt.ALL:
      break;
    case wt.NONE:
    default:
      r.startRow += n, r.startColumn += e;
      break;
  }
  switch (t.endAbsoluteRefType) {
    case wt.ROW:
      r.endColumn += e;
      break;
    case wt.COLUMN:
      r.endRow += n;
      break;
    case wt.ALL:
      break;
    case wt.NONE:
    default:
      r.endRow += n, r.endColumn += e;
      break;
  }
  return r;
});
function Ty(t, e) {
  if (t.length === 0 || t[0].length === 0) return null;
  let n = Array(t[0].length).fill(0), r = 0, s = null;
  for (let i = 0; i < t.length; i++) {
    for (let a = 0; a < t[0].length; a++) n[a] = e(t[i][a]) ? n[a] + 1 : 0;
    let o = Sy(n);
    o.area > r && (r = o.area, s = { startColumn: o.start, startRow: i - o.height + 1, endColumn: o.end, endRow: i });
  }
  return s;
}
function Sy(t) {
  let e = [], n = 0, r = { area: 0, height: 0, start: 0, end: 0 }, s = 0;
  for (; s < t.length; ) if (e.length === 0 || t[s] >= t[e[e.length - 1]]) e.push(s++);
  else {
    let i = t[e.pop()], o = e.length === 0 ? s : s - e[e.length - 1] - 1;
    i * o > n && (n = i * o, r = { area: n, height: i, start: e.length === 0 ? 0 : e[e.length - 1] + 1, end: s - 1 });
  }
  for (; e.length > 0; ) {
    let i = t[e.pop()], o = e.length === 0 ? s : s - e[e.length - 1] - 1;
    i * o > n && (n = i * o, r = { area: n, height: i, start: e.length === 0 ? 0 : e[e.length - 1] + 1, end: s - 1 });
  }
  return r;
}
function wy(t, e) {
  Ls.foreach(e, (n, r) => {
    t[n][r] = void 0;
  });
}
function v1(t, e) {
  let n = t.toFullArray(), r = [];
  for (; ; ) {
    let s = Ty(n, e);
    if (!s) break;
    r.push(s), wy(n, s);
  }
  return r;
}
var C1 = class {
  constructor(t, e) {
    y(this, "_values", []), y(this, "_keys", []), y(this, "_keyMaps", /* @__PURE__ */ new Map()), this._values = t, this._keys = e, t.forEach((n) => {
      this._initKeyMap(n);
    });
  }
  _initKeyMap(t) {
    this._keys.forEach((e) => {
      let n = t[e], r = this._keyMaps.get(e) || /* @__PURE__ */ new Map();
      r.set(n, t), this._keyMaps.set(e, r);
    });
  }
  getValue(t, e) {
    let n = e || this._keys;
    for (let r = 0; r < n.length; r++) {
      let s = this._keyMaps.get(n[r]);
      if (s != null && s.has(t)) return s.get(t);
    }
    return null;
  }
  hasValue(t) {
    for (let e = 0; e < this._keys.length; e++) {
      let n = this._keyMaps.get(this._keys[e]);
      if (n != null && n.has(t)) return !0;
    }
    return !1;
  }
  addValue(t) {
    this._values.push(t), this._initKeyMap(t);
  }
  setValue(t, e, n) {
    let r = this.getValue(t);
    r && Object.keys(r).includes(e) && (r[e] = n);
  }
  deleteValue(t, e) {
    let n = this.getValue(t, e);
    if (n) {
      this._keys.forEach((s) => {
        let i = this._keyMaps.get(s), o = n[s];
        i == null || i.delete(o);
      });
      let r = this._values.findIndex((s) => s === n);
      this._values.splice(r, 1);
    }
  }
  getValues() {
    return this._values;
  }
  getKeyMap(t) {
    var e;
    return [...((e = this._keyMaps.get(t)) == null ? void 0 : e.keys()) || []];
  }
  clear() {
    this._values = [], this._keys = [], this._keyMaps.clear();
  }
};
function ru(t, e, n, r) {
  return { forEach(s) {
    for (let i = t; i <= e; i++) for (let o = n; o <= r; o++) s(i, o);
  } };
}
function R1(t) {
  if (t == null || t.length === 0) return NaN;
  let e = t.toLowerCase().split(""), n = e.length, r = (o) => o.charCodeAt(0) - 96, s = 0, i = 0;
  for (let o = 0; o < n; o++) i = r(e[o]), s += i * 26 ** (n - o - 1);
  return s === 0 ? NaN : s - 1;
}
function b1(t) {
  let e = "";
  for (; t >= 0; ) e = String.fromCharCode(t % 26 + 65) + e, t = Math.floor(t / 26) - 1;
  return e;
}
function Oy(t, e) {
  let n = "";
  for (; e > 0; ) n += t, e--;
  return n;
}
function I1(t, e = !1) {
  let n = 97;
  return e && (n = 65), Oy(String.fromCharCode(t % 26 + n), Math.floor(t / 26) + 1);
}
function T1(t, e) {
  return t.zIndex > e.zIndex ? 1 : t.zIndex === e.zIndex ? 0 : -1;
}
function S1(t, e) {
  return t.zIndex > e.zIndex ? -1 : t.zIndex === e.zIndex ? 0 : 1;
}
function Zs(t = "index", e = 1) {
  return (n, r) => n[t] > r[t] ? e : n[t] === r[t] ? 0 : -e;
}
function qs(t, e = !1) {
  let n = [];
  for (let r of t) {
    let { st: s, ed: i, ts: o } = r;
    if (r.sId === void 0 && delete r.sId, s === i || !e && j.isEmptyObject(o) && r.sId == null) continue;
    if (n.length === 0) {
      n.push(r);
      continue;
    }
    let a = n.pop();
    dy(r, a) && j.hasIntersectionBetweenTwoRanges(a.st, a.ed, r.st, r.ed) ? n.push({ ...r, st: a.st, ed: i }) : n.push(a, r);
  }
  return n;
}
function gd(t, e, n, r) {
  var s;
  let { textRuns: i } = t;
  if (i == null) return;
  let o = [], a = i.length, l = !1, u = (s = e.textRuns) == null ? [] : s;
  if (u.length) for (let c of u) c.st += r, c.ed += r;
  for (let c = 0; c < a; c++) {
    let d = i[c], { st: h, ed: f } = d;
    if (f <= r) o.push(d);
    else if (r > h && r < f) {
      l = !0;
      let p = { ...d, ed: r };
      o.push(p), u.length && o.push(...u);
      let g = { ...d, st: r + n, ed: f + n };
      o.push(g);
    } else d.st += n, d.ed += n, l || (l = !0, o.push(...u)), o.push(d);
  }
  l || (l = !0, o.push(...u)), t.textRuns = qs(o);
}
function md(t, e, n, r) {
  let { paragraphs: s } = t;
  if (s == null) return;
  let { paragraphs: i } = e, o = [];
  for (let l = 0, u = s.length; l < u; l++) {
    let c = s[l], { startIndex: d } = c;
    d >= r && (c.startIndex += n), o.push(c.startIndex);
  }
  let a = -1;
  if (i) {
    for (let l = 0, u = i.length; l < u; l++) {
      let c = i[l];
      c.startIndex += r;
      let d = c.startIndex;
      a = o.indexOf(d);
    }
    a !== -1 && s.splice(a, 1), s.push(...i), s.sort(Zs("startIndex"));
  }
}
function _d(t, e, n, r) {
  let { sectionBreaks: s } = t;
  if (s == null) return;
  for (let o = 0, a = s.length; o < a; o++) {
    let l = s[o], { startIndex: u } = l;
    u >= r && (l.startIndex += n);
  }
  let i = e.sectionBreaks;
  if (i) {
    for (let o = 0, a = i.length; o < a; o++) {
      let l = i[o];
      l.startIndex += r;
    }
    s.push(...i), s.sort(Zs("startIndex"));
  }
}
function yd(t, e, n, r) {
  let { customBlocks: s = [] } = t;
  for (let o = 0, a = s.length; o < a; o++) {
    let l = s[o], { startIndex: u } = l;
    u >= r && (l.startIndex += n);
  }
  let i = e.customBlocks;
  if (i) {
    for (let o = 0, a = i.length; o < a; o++) {
      let l = i[o];
      l.startIndex += r;
    }
    s.push(...i), s.sort(Zs("startIndex"));
  }
  s.length && !t.customBlocks && (t.customBlocks = s);
}
function Ed(t, e, n, r) {
  let { tables: s } = t;
  if (s == null) return;
  for (let o = 0, a = s.length; o < a; o++) {
    let l = s[o], { startIndex: u, endIndex: c } = l;
    u > r ? (l.startIndex += n, l.endIndex += n) : c > r && (l.endIndex += n);
  }
  let i = e.tables;
  if (i) {
    for (let o = 0, a = i.length; o < a; o++) {
      let l = i[o];
      l.startIndex += r, l.endIndex += r;
    }
    s.push(...i), s.sort(Zs("startIndex"));
  }
}
const su = (t) => t.split("$")[0];
function Na(t) {
  if (t.length <= 1) return t;
  t.sort((s, i) => s.startIndex - i.startIndex);
  let e = [], n = { ...t[0] };
  n.rangeId = su(n.rangeId);
  for (let s = 1; s < t.length; s++) {
    let i = t[s];
    i.rangeId = su(i.rangeId), i.rangeId === n.rangeId && l_(n.properties, i.properties) && n.endIndex + 1 >= i.startIndex ? n.endIndex = i.endIndex : (e.push(n), n = { ...i });
  }
  e.push(n);
  let r = /* @__PURE__ */ Object.create(null);
  for (let s = 0, i = e.length; s < i; s++) {
    let o = e[s], a = o.rangeId;
    r[a] ? (o.rangeId = `${a}$${r[a]}`, r[a] = r[a] + 1) : r[a] = 1;
  }
  return e;
}
function zi(t, e) {
  let n = t.findIndex((s) => s.startIndex < e && s.endIndex >= e), r = t[n];
  r && t.splice(n, 1, { rangeId: r.rangeId, rangeType: r.rangeType, startIndex: r.startIndex, endIndex: e - 1, properties: { ...r.properties } }, { rangeId: r.rangeId, rangeType: r.rangeType, startIndex: e, endIndex: r.endIndex, properties: { ...r.properties } });
}
function vd(t) {
  if (t.length <= 1) return t;
  t.sort((r, s) => r.startIndex - s.startIndex);
  let e = [], n = { ...t[0] };
  for (let r = 1; r < t.length; r++) {
    let s = t[r];
    s.id === n.id && n.endIndex + 1 >= s.startIndex ? n.endIndex = s.endIndex : (e.push(n), n = { ...s });
  }
  return e.push(n), e;
}
function Ki(t, e) {
  t.filter((n) => n.startIndex < e && n.endIndex >= e).forEach((n) => {
    let r = t.indexOf(n);
    t.splice(r, 1, { id: n.id, type: n.type, startIndex: n.startIndex, endIndex: e - 1 }, { id: n.id, type: n.type, startIndex: e, endIndex: n.endIndex });
  });
}
function Ay(t, e, n, r) {
  t.customRanges || (t.customRanges = []);
  let { customRanges: s } = t;
  zi(s, r);
  for (let o = 0, a = s.length; o < a; o++) {
    let l = s[o], { startIndex: u } = l;
    u >= r && (l.startIndex += n, l.endIndex += n);
  }
  let i = [];
  if (e.customRanges) {
    for (let o = 0, a = e.customRanges.length; o < a; o++) {
      let l = e.customRanges[o];
      l.startIndex += r, l.endIndex += r, i.push(l);
    }
    s.push(...i);
  }
  t.customRanges = Na(s);
}
function Ny(t, e, n, r) {
  t.customDecorations || (t.customDecorations = []);
  let { customDecorations: s } = t;
  Ki(s, r);
  for (let o = 0, a = s.length; o < a; o++) {
    let l = s[o], { startIndex: u } = l;
    u >= r && (l.startIndex += n, l.endIndex += n);
  }
  let i = [];
  if (e.customDecorations) {
    for (let o = 0, a = e.customDecorations.length; o < a; o++) {
      let l = e.customDecorations[o];
      l.startIndex += r, l.endIndex += r, i.push(l);
    }
    s.push(...i);
  }
  t.customDecorations = vd(s);
}
function Cd(t, e, n) {
  let { textRuns: r } = t, s = n, i = n + e, o = [];
  if (r) {
    let a = [];
    for (let l = 0, u = r.length; l < u; l++) {
      let c = r[l], { st: d, ed: h } = c;
      if (s <= d && i >= h) {
        o.push({ ...c, st: d - s, ed: h - s });
        continue;
      } else d <= s && h >= i ? (o.push({ ...c, st: s - s, ed: i - s }), c.ed -= e) : s >= d && s < h ? (o.push({ ...c, st: s - s, ed: h - s }), c.ed = s) : i > d && i <= h ? (o.push({ ...c, st: d - s, ed: i - s }), c.st = i - e, c.ed -= e) : d >= i && (c.st -= e, c.ed -= e);
      a.push(c);
    }
    t.textRuns = a;
  }
  return o.length === 0 && o.push({ st: 0, ed: e, ts: {} }), o;
}
function Rd(t, e, n) {
  let { paragraphs: r } = t, s = n, i = n + e, o = [];
  if (r) {
    let a = [];
    for (let l = 0, u = r.length; l < u; l++) {
      let c = r[l], { startIndex: d } = c;
      if (d >= s && d < i) {
        o.push({ ...c, startIndex: d - n });
        continue;
      } else d >= i && (c.startIndex -= e);
      a.push(c);
    }
    t.paragraphs = a;
  }
  return o;
}
function bd(t, e, n) {
  let { sectionBreaks: r } = t, s = n, i = n + e - 1, o = [];
  if (r) {
    let a = [];
    for (let l = 0, u = r.length; l < u; l++) {
      let c = r[l], { startIndex: d } = c;
      if (d >= s && d <= i) {
        o.push({ ...c, startIndex: d - n });
        continue;
      } else d > i && (c.startIndex -= e);
      a.push(c);
    }
    t.sectionBreaks = a;
  }
  return o;
}
function Id(t, e, n) {
  let { customBlocks: r = [] } = t, s = n, i = n + e - 1, o = [];
  if (r) {
    let a = [];
    for (let l = 0, u = r.length; l < u; l++) {
      let c = r[l], { startIndex: d } = c;
      if (d >= s && d <= i) {
        o.push({ ...c, startIndex: d - n });
        continue;
      } else d > i && (c.startIndex -= e);
      a.push(c);
    }
    t.customBlocks = a;
  }
  return r.length && !t.customBlocks && (t.customBlocks = r), o;
}
function Td(t, e, n) {
  let { tables: r } = t, s = n, i = n + e - 1, o = [];
  if (r) {
    let a = [];
    for (let l = 0, u = r.length; l < u; l++) {
      let c = r[l], { startIndex: d, endIndex: h } = c;
      if (s <= d && i >= h) {
        o.push({ ...c, startIndex: d - n, endIndex: h - n });
        continue;
      } else if (d <= s && h >= i) {
        let f = Oa(d, h, s, i);
        if (f.length === 0 || (c.startIndex = f[0], c.endIndex = f[1], c.startIndex === c.endIndex)) continue;
      } else i < d && (c.startIndex -= e, c.endIndex -= e);
      a.push(c);
    }
    t.tables = a;
  }
  return o;
}
function Dy(t, e, n) {
  let { customRanges: r } = t, s = n, i = n + e - 1, o = [];
  if (r) {
    let a = [];
    for (let l = 0, u = r.length; l < u; l++) {
      let c = r[l], { startIndex: d, endIndex: h } = c;
      if (d >= s && h <= i) {
        o.push(c);
        continue;
      } else if (Math.max(s, d) <= Math.min(i, h)) {
        let f = Oa(d, h, s, i);
        if (f.length === 0) continue;
        c.startIndex = f[0], c.endIndex = f[1];
      } else i < d && (c.startIndex -= e, c.endIndex -= e);
      a.push(c);
    }
    t.customRanges = Na(a);
  }
  return o;
}
function My(t, e, n, r = !0) {
  let { customDecorations: s } = t, i = n, o = n + e - 1, a = [];
  if (s) {
    let l = [];
    for (let u = 0, c = s.length; u < c; u++) {
      let d = s[u], { startIndex: h, endIndex: f } = d;
      if (h >= i && f <= o) {
        a.push(d);
        continue;
      } else if (Math.max(i, h) <= Math.min(o, f)) {
        let p = Oa(h, f, i, o);
        if (p.length === 0) continue;
        d.startIndex = p[0], d.endIndex = p[1];
      } else o < h && r && (d.startIndex -= e, d.endIndex -= e);
      l.push(d);
    }
    t.customDecorations = l;
  }
  return a;
}
let Oe = function(t) {
  return t.ORDER_LIST_QUICK_1 = "1.", t.ORDER_LIST_QUICK_2 = "a)", t.ORDER_LIST_QUICK_3 = "a.", t.ORDER_LIST_QUICK_4 = "i.", t.ORDER_LIST_QUICK_5 = "A.", t.ORDER_LIST_QUICK_6 = "I.", t.ORDER_LIST_QUICK_7 = "01.", t.BULLET_LIST = "*", t;
}({}), ot = function(t) {
  return t.BULLET_LIST = "BULLET_LIST", t.BULLET_LIST_1 = "BULLET_LIST_1", t.BULLET_LIST_2 = "BULLET_LIST_2", t.BULLET_LIST_3 = "BULLET_LIST_3", t.BULLET_LIST_4 = "BULLET_LIST_4", t.BULLET_LIST_5 = "BULLET_LIST_5", t.ORDER_LIST = "ORDER_LIST", t.ORDER_LIST_1 = "ORDER_LIST_1", t.ORDER_LIST_2 = "ORDER_LIST_2", t.ORDER_LIST_3 = "ORDER_LIST_3", t.ORDER_LIST_4 = "ORDER_LIST_4", t.ORDER_LIST_5 = "ORDER_LIST_5", t.ORDER_LIST_QUICK_2 = "ORDER_LIST_QUICK_2", t.ORDER_LIST_QUICK_3 = "ORDER_LIST_QUICK_3", t.ORDER_LIST_QUICK_4 = "ORDER_LIST_QUICK_4", t.ORDER_LIST_QUICK_5 = "ORDER_LIST_QUICK_5", t.ORDER_LIST_QUICK_6 = "ORDER_LIST_QUICK_6", t.CHECK_LIST = "CHECK_LIST", t.CHECK_LIST_CHECKED = "CHECK_LIST_CHECKED", t;
}({});
const us = { "a)": { glyphFormat: "%1)", glyphType: nt.DECIMAL }, "1.": { glyphFormat: "%1.", glyphType: nt.DECIMAL }, "a.": { glyphFormat: "%1.", glyphType: nt.LOWER_LETTER }, "A.": { glyphFormat: "%1.", glyphType: nt.UPPER_LETTER }, "i.": { glyphFormat: "%1.", glyphType: nt.LOWER_ROMAN }, "I.": { glyphFormat: "%1.", glyphType: nt.UPPER_LETTER } }, kn = (t) => [...t, ...t, ...t].map((e, n) => ({ glyphFormat: ` %${n + 1}`, glyphSymbol: e, bulletAlignment: Sa.START, textStyle: { fs: 12 }, startNumber: 0, paragraphProperties: { hanging: { v: 21 }, indentStart: { v: 21 * n } } })), Bn = (t) => t.map((e, n) => ({ ...e, bulletAlignment: Sa.START, textStyle: { fs: 12 }, startNumber: 0, paragraphProperties: { hanging: { v: 21 }, indentStart: { v: 21 * n } } })), iu = (t, e) => Array(9).fill(0).map((n, r) => ({ glyphFormat: ` %${r + 1}`, glyphSymbol: t, bulletAlignment: Sa.START, textStyle: { fs: 16 }, startNumber: 0, paragraphProperties: { hanging: { v: 21 }, indentStart: { v: 21 * r }, textStyle: e } })), ti = { [ot.BULLET_LIST]: { listType: ot.BULLET_LIST, nestingLevel: kn(["●", "○", "■"]) }, [ot.BULLET_LIST_1]: { listType: ot.BULLET_LIST, nestingLevel: kn(["❖", "➢", "■"]) }, [ot.BULLET_LIST_2]: { listType: ot.BULLET_LIST, nestingLevel: kn(["✔", "●", "◆"]) }, [ot.BULLET_LIST_3]: { listType: ot.BULLET_LIST, nestingLevel: kn(["■", "◆", "○"]) }, [ot.BULLET_LIST_4]: { listType: ot.BULLET_LIST, nestingLevel: kn(["✧", "○", "■"]) }, [ot.BULLET_LIST_5]: { listType: ot.BULLET_LIST, nestingLevel: kn(["➢", "○", "◆"]) }, [ot.ORDER_LIST]: { listType: ot.ORDER_LIST, nestingLevel: Bn([{ glyphFormat: "%1.", glyphType: nt.DECIMAL }, { glyphFormat: "%2.", glyphType: nt.LOWER_LETTER }, { glyphFormat: "%3.", glyphType: nt.LOWER_ROMAN }, { glyphFormat: "%4.", glyphType: nt.DECIMAL }, { glyphFormat: "%5.", glyphType: nt.LOWER_LETTER }, { glyphFormat: "%6.", glyphType: nt.LOWER_ROMAN }, { glyphFormat: "%7.", glyphType: nt.DECIMAL }, { glyphFormat: "%8.", glyphType: nt.LOWER_LETTER }, { glyphFormat: "%9.", glyphType: nt.LOWER_ROMAN }]) }, [ot.ORDER_LIST_1]: { listType: ot.ORDER_LIST, nestingLevel: Bn([{ glyphFormat: "%1)", glyphType: nt.DECIMAL }, { glyphFormat: "%2)", glyphType: nt.LOWER_LETTER }, { glyphFormat: "%3)", glyphType: nt.LOWER_ROMAN }, { glyphFormat: "%4)", glyphType: nt.DECIMAL }, { glyphFormat: "%5)", glyphType: nt.LOWER_LETTER }, { glyphFormat: "%6)", glyphType: nt.LOWER_ROMAN }, { glyphFormat: "%7)", glyphType: nt.DECIMAL }, { glyphFormat: "%8)", glyphType: nt.LOWER_LETTER }, { glyphFormat: "%9)", glyphType: nt.LOWER_ROMAN }]) }, [ot.ORDER_LIST_2]: { listType: ot.ORDER_LIST, nestingLevel: Bn(["%1.", "%1.%2.", "%1.%2.%3.", "%1.%2.%3.%4.", "%1.%2.%3.%4.%5.", "%1.%2.%3.%4.%5.%6.", "%1.%2.%3.%4.%5.%6.%7."].map((t) => ({ glyphFormat: t, glyphType: nt.DECIMAL }))) }, [ot.ORDER_LIST_3]: { listType: ot.ORDER_LIST, nestingLevel: Bn([{ glyphFormat: "%1.", glyphType: nt.UPPER_LETTER }, { glyphFormat: "%2.", glyphType: nt.LOWER_LETTER }, { glyphFormat: "%3.", glyphType: nt.LOWER_ROMAN }, { glyphFormat: "%4.", glyphType: nt.UPPER_LETTER }, { glyphFormat: "%5.", glyphType: nt.LOWER_LETTER }, { glyphFormat: "%6.", glyphType: nt.LOWER_ROMAN }, { glyphFormat: "%7.", glyphType: nt.UPPER_LETTER }, { glyphFormat: "%8.", glyphType: nt.LOWER_LETTER }, { glyphFormat: "%9.", glyphType: nt.LOWER_ROMAN }]) }, [ot.ORDER_LIST_4]: { listType: ot.ORDER_LIST, nestingLevel: Bn([{ glyphFormat: "%1.", glyphType: nt.UPPER_LETTER }, { glyphFormat: "%2.", glyphType: nt.DECIMAL }, { glyphFormat: "%3.", glyphType: nt.LOWER_ROMAN }, { glyphFormat: "%4.", glyphType: nt.UPPER_LETTER }, { glyphFormat: "%5.", glyphType: nt.DECIMAL }, { glyphFormat: "%6.", glyphType: nt.LOWER_ROMAN }, { glyphFormat: "%7.", glyphType: nt.UPPER_LETTER }, { glyphFormat: "%8.", glyphType: nt.DECIMAL }, { glyphFormat: "%9.", glyphType: nt.LOWER_ROMAN }]) }, [ot.ORDER_LIST_5]: { listType: ot.ORDER_LIST, nestingLevel: Bn([{ glyphFormat: "%1.", glyphType: nt.DECIMAL_ZERO }, { glyphFormat: "%2.", glyphType: nt.LOWER_LETTER }, { glyphFormat: "%3.", glyphType: nt.LOWER_ROMAN }, { glyphFormat: "%4.", glyphType: nt.DECIMAL_ZERO }, { glyphFormat: "%5.", glyphType: nt.LOWER_LETTER }, { glyphFormat: "%6.", glyphType: nt.LOWER_ROMAN }, { glyphFormat: "%7.", glyphType: nt.DECIMAL_ZERO }, { glyphFormat: "%8.", glyphType: nt.LOWER_LETTER }, { glyphFormat: "%9.", glyphType: nt.LOWER_ROMAN }]) }, [ot.CHECK_LIST]: { listType: ot.CHECK_LIST, nestingLevel: iu("☐") }, [ot.CHECK_LIST_CHECKED]: { listType: ot.CHECK_LIST_CHECKED, nestingLevel: iu("☑", { st: { s: z.TRUE } }) } }, cs = (t) => {
  let { glyphFormat: e, glyphType: n } = t, r = j.deepClone(ti[ot.ORDER_LIST]);
  return r.nestingLevel[0].glyphFormat = e, r.nestingLevel[0].glyphType = n, r;
}, Ly = { [ot.ORDER_LIST_QUICK_2]: cs(us[Oe.ORDER_LIST_QUICK_2]), [ot.ORDER_LIST_QUICK_3]: cs(us[Oe.ORDER_LIST_QUICK_3]), [ot.ORDER_LIST_QUICK_4]: cs(us[Oe.ORDER_LIST_QUICK_4]), [ot.ORDER_LIST_QUICK_6]: cs(us[Oe.ORDER_LIST_QUICK_6]) };
Object.assign(ti, Ly);
const w1 = { [Oe.ORDER_LIST_QUICK_1]: ot.ORDER_LIST, [Oe.ORDER_LIST_QUICK_2]: ot.ORDER_LIST_QUICK_2, [Oe.ORDER_LIST_QUICK_3]: ot.ORDER_LIST_QUICK_3, [Oe.ORDER_LIST_QUICK_4]: ot.ORDER_LIST_QUICK_4, [Oe.ORDER_LIST_QUICK_5]: ot.ORDER_LIST_3, [Oe.ORDER_LIST_QUICK_6]: ot.ORDER_LIST_QUICK_6, [Oe.ORDER_LIST_QUICK_7]: ot.ORDER_LIST_5, [Oe.BULLET_LIST]: ot.BULLET_LIST };
function xy(t, e, n, r, s) {
  return { dataStream: "", textRuns: Fy(t, e, n, r, s), paragraphs: Uy(t, e, n, r, s), sectionBreaks: Py(t, e, n, r, s), customBlocks: ky(t, e, n, r, s), tables: By(t, e, n, r, s), customRanges: Hy(t, e, n, r), customDecorations: jy(t, e, n, r, s) };
}
function Fy(t, e, n, r, s) {
  let { textRuns: i } = t, { textRuns: o } = e;
  if (i == null || o == null) return;
  let a = Cd(t, n, r);
  return s !== ft.REPLACE && (e.textRuns = Sd(o, a, s)), gd(t, e, n, r), a;
}
function Sd(t, e, n) {
  if (e.length === 0) return t;
  t = j.deepClone(t), e = j.deepClone(e);
  let r = [], s = t.length, i = e.length, o = 0, a = 0, l = null;
  function u() {
    return l ? (r.push(l), l = null, !0) : !1;
  }
  for (; o < s && a < i; ) {
    let { st: f, ed: p, ts: g } = t[o], { st: _, ed: C, ts: S, sId: T } = e[a], w;
    if (w = n === ft.COVER ? { ...S, ...g } : { ...g }, p < _) u() || r.push(t[o]), o++;
    else if (C < f) u() || r.push(e[a]), a++;
    else {
      let E = { st: Math.min(f, _), ed: Math.max(f, _), ts: f < _ ? { ...g } : { ...S }, sId: f < _ ? void 0 : T };
      E.ed > E.st && r.push(E), r.push({ st: Math.max(f, _), ed: Math.min(p, C), ts: w, sId: T }), p < C ? (o++, e[a].st = p, e[a].st === e[a].ed && a++) : (a++, t[o].st = C, t[o].st === t[o].ed && o++);
      let v = { st: Math.min(p, C), ed: Math.max(p, C), ts: p < C ? { ...S } : { ...g }, sId: p < C ? T : void 0 };
      l = v.ed > v.st ? v : null;
    }
  }
  u();
  let c = r[r.length - 1], d = t[s - 1], h = e[i - 1];
  return c && c.ed !== Math.max(d.ed, h.ed) && (d.ed > h.ed ? r.push(d) : r.push(h)), qs(r);
}
function Uy(t, e, n, r, s) {
  let { paragraphs: i } = t, { paragraphs: o } = e;
  if (i == null || o == null) return;
  let a = Rd(t, n, r);
  if (s !== ft.REPLACE) {
    let l = [];
    for (let u of o) {
      let { startIndex: c, paragraphStyle: d, bullet: h } = u, f = [];
      for (let p of a) {
        let { startIndex: g, paragraphStyle: _, bullet: C } = p, S, T;
        if (s === ft.COVER ? (S = { ..._, ...d }, T = { listId: "", listType: ot.BULLET_LIST, nestingLevel: 0, textStyle: {}, ...C, ...h }) : (S = { ...d, ..._ }, T = { listId: "", listType: ot.BULLET_LIST, nestingLevel: 0, textStyle: {}, ...h, ...C }), c === g) {
          f.push({ startIndex: c, paragraphStyle: S, bullet: T });
          break;
        }
      }
      l.push(...f), f = [];
    }
    e.paragraphs = l;
  }
  return md(t, e, n, r), a;
}
function Py(t, e, n, r, s) {
  let { sectionBreaks: i } = t, { sectionBreaks: o } = e;
  if (i == null || o == null) return;
  let a = bd(t, n, r);
  if (s !== ft.REPLACE) {
    let l = [];
    for (let u of o) {
      let { startIndex: c } = u, d = [];
      for (let h of a) {
        let { startIndex: f } = h;
        if (c === f) {
          s === ft.COVER ? d.push({ ...h, ...u }) : d.push({ ...u, ...h });
          break;
        }
      }
      l.push(...d), d = [];
    }
    e.sectionBreaks = l;
  }
  return _d(t, e, n, r), a;
}
function ky(t, e, n, r, s) {
  let { customBlocks: i = [] } = t, { customBlocks: o } = e;
  if (i == null || o == null) return;
  let a = Id(t, n, r);
  if (s !== ft.REPLACE) {
    let l = [];
    for (let u of o) {
      let { startIndex: c } = u, d = [];
      for (let h of a) {
        let { startIndex: f } = h;
        if (c === f) {
          s === ft.COVER ? d.push({ ...h, ...u }) : d.push({ ...u, ...h });
          break;
        }
      }
      l.push(...d), d = [];
    }
    e.customBlocks = l;
  }
  return yd(t, e, n, r), i.length && !t.customBlocks && (t.customBlocks = i), a;
}
function By(t, e, n, r, s) {
  let { tables: i } = t, { tables: o } = e;
  if (i == null || o == null) return;
  let a = Td(t, n, r);
  if (s !== ft.REPLACE) {
    let l = [];
    for (let u of o) {
      let { startIndex: c, endIndex: d } = u, h = [];
      for (let f of a) {
        let { startIndex: p, endIndex: g } = f;
        if (p >= c && g <= d) {
          s === ft.COVER ? h.push({ ...f, ...u }) : h.push({ ...u, ...f });
          break;
        }
      }
      l.push(...h), h = [];
    }
    e.tables = l;
  }
  return Ed(t, e, n, r), a;
}
function Hy(t, e, n, r, s) {
  t.customRanges || (t.customRanges = []), zi(t.customRanges, r), zi(t.customRanges, r + n);
  let i = r, o = r + n - 1, { customRanges: a } = e, l = [], u = /* @__PURE__ */ new Map();
  return t.customRanges.forEach((c) => {
    let { startIndex: d, endIndex: h } = c;
    d >= i && h <= o ? u.set(c.rangeId, c) : l.push(c);
  }), a ? (a.forEach((c) => {
    let { startIndex: d, endIndex: h } = c;
    l.push({ ...c, startIndex: d + r, endIndex: h + r });
  }), t.customRanges = Na(l), []) : [];
}
function jy(t, e, n, r, s) {
  t.customDecorations || (t.customDecorations = []), Ki(t.customDecorations, r), Ki(t.customDecorations, r + n);
  let i = [], { customDecorations: o } = t, { customDecorations: a = [] } = e;
  if (s === ft.REPLACE) {
    for (let l = 0; l < o.length; l++) {
      let u = o[l], { startIndex: c, endIndex: d } = u;
      c >= r && d <= r + n - 1 && i.push(u);
    }
    a.forEach((l) => {
      let { startIndex: u, endIndex: c } = l;
      o.push({ ...l, startIndex: u + r, endIndex: c + r });
    });
  } else for (let l of a) {
    let { id: u } = l;
    if (l.type === Mr.DELETED) {
      let c = o.filter((d) => d.id === u);
      c.length && i.push(...c);
    } else o.push({ ...l, startIndex: l.startIndex + r, endIndex: l.endIndex + r });
  }
  for (let l of i) {
    let { id: u } = l, c = o.findIndex((d) => d.id === u);
    c !== -1 && o.splice(c, 1);
  }
  return t.customDecorations = vd(o), i;
}
let Xi = function(t) {
  return t[t.copy = 0] = "copy", t[t.cut = 1] = "cut", t;
}({});
function Qi(t, e, n, r = !0) {
  let { textRuns: s } = t;
  if (s) {
    let i = [];
    for (let o of s) {
      let a = j.deepClone(o), { st: l, ed: u } = a;
      j.hasIntersectionBetweenTwoRanges(l, u, e, n) && (e >= l && e <= u ? i.push({ ...a, st: e, ed: Math.min(n, u) }) : n >= l && n <= u ? i.push({ ...a, st: Math.max(e, l), ed: n }) : i.push(a));
    }
    return qs(i.map((o) => {
      let { st: a, ed: l } = o;
      return { ...o, st: a - e, ed: l - e };
    }));
  } else if (r) return [{ st: 0, ed: n - e, ts: {} }];
}
function $y(t, e, n) {
  let { tables: r = [] } = t, s = [];
  for (let i of r) {
    let o = j.deepClone(i), { startIndex: a, endIndex: l } = o;
    a >= e && l <= n && s.push({ ...o, startIndex: a - e, endIndex: l - e });
  }
  return s;
}
function Wy(t, e, n) {
  let { paragraphs: r = [] } = t, s = [];
  for (let i of r) {
    let { startIndex: o } = i;
    if (o >= e && o < n) {
      let a = j.deepClone(i);
      s.push(a);
    }
  }
  if (s.length) return s.map((i) => ({ ...i, startIndex: i.startIndex - e }));
}
function O1(t, e, n) {
  let { sectionBreaks: r = [] } = t, s = [];
  for (let i of r) {
    let { startIndex: o } = i;
    o >= e && o <= n && s.push(j.deepClone(i));
  }
  if (s.length) return s.map((i) => ({ ...i, startIndex: i.startIndex - e }));
}
function Vy(t, e, n) {
  let { customBlocks: r = [] } = t, s = [];
  for (let i of r) {
    let { startIndex: o } = i;
    o >= e && o < n && s.push(j.deepClone(i));
  }
  if (s.length) return s.map((i) => ({ ...i, startIndex: i.startIndex - e }));
}
function Xe(t, e, n, r = !0, s = Xi.cut) {
  let { dataStream: i } = t, o = { dataStream: i.slice(e, n) };
  o.textRuns = Qi(t, e, n, r);
  let a = $y(t, e, n);
  if (a.length && (o.tables = a), o.paragraphs = Wy(t, e, n), s === Xi.cut) {
    let u = Yy(t, e, n);
    u ? o.customDecorations = u : r && (o.customDecorations = []);
  }
  let { customRanges: l } = Gy(t, e, n);
  return l ? o.customRanges = l : r && (o.customRanges = []), o.customBlocks = Vy(t, e, n), o;
}
function A1(t) {
  let { dataStream: e, textRuns: n, paragraphs: r, customRanges: s, customDecorations: i, tables: o } = t, a = 0, l = 0;
  s == null || s.forEach((c) => {
    c.startIndex < 0 && (a = Math.max(a, -c.startIndex)), c.endIndex > e.length - 1 && (l = Math.max(l, c.endIndex - e.length + 1));
  });
  let u = `${e}`;
  return n && (n[0] && (n[0].st = n[0].st - a), n[n.length - 1] && (n[n.length - 1].ed = n[n.length - 1].ed + l)), n == null || n.forEach((c) => {
    c.st += a, c.ed += a;
  }), r == null || r.forEach((c) => {
    c.startIndex += a;
  }), s == null || s.forEach((c) => {
    c.startIndex += a, c.endIndex += a;
  }), i == null || i.forEach((c) => {
    c.startIndex += a, c.endIndex += l;
  }), o == null || o.forEach((c) => {
    c.startIndex += a, c.endIndex += l;
  }), { ...t, dataStream: u, textRuns: n, paragraphs: r, customRanges: s, customDecorations: i, tables: o };
}
function Gy(t, e, n) {
  if (t.customRanges == null) return {};
  let { customRanges: r } = t;
  return { customRanges: r.filter((s) => Math.max(s.startIndex, e) <= Math.min(s.endIndex, n - 1)).map((s) => ({ ...s, startIndex: Math.max(s.startIndex, e), endIndex: Math.min(s.endIndex, n - 1) })).map((s) => ({ ...s, startIndex: s.startIndex - e, endIndex: s.endIndex - e })), leftOffset: 0, rightOffset: 0 };
}
function Yy(t, e, n) {
  if (t.customDecorations == null) return;
  let { customDecorations: r = [] } = t, s = [];
  return r.forEach((i) => {
    if (Math.max(i.startIndex, e) <= Math.min(i.endIndex, n - 1)) {
      let o = j.deepClone(i);
      s.push({ ...o, startIndex: Math.max(o.startIndex - e, 0), endIndex: Math.min(o.endIndex, n - 1) - e });
    }
  }), s;
}
function zy(t, e, n) {
  return t == null || e == null ? t ?? e : Sd(t, e, n);
}
function Ky(t, e, n) {
  if (t == null || e == null) return t ?? e;
  if (e.length === 0 || t.length === 0) return t;
  if (e.length > 1 || t.length > 1) throw Error("Cannot cover multiple customRanges");
  return n === ft.REPLACE ? [{ ...t[0] }] : [{ ...e[0], ...t[0] }];
}
function Xy(t, e, n) {
  return e.length === 0 || t.length === 0 || n === ft.REPLACE ? t : [...t, ...e.filter((r) => !t.some((s) => r.id === s.id))];
}
function ou(t, e, n = ft.COVER) {
  if (e.dataStream !== "") throw Error("Cannot compose other body with non-empty dataStream");
  let r = { dataStream: t.dataStream }, { textRuns: s, paragraphs: i = [], customRanges: o, customDecorations: a = [] } = t, { textRuns: l, paragraphs: u = [], customRanges: c, customDecorations: d = [] } = e;
  r.textRuns = zy(l, s, n), r.customRanges = Ky(c, o, n);
  let h = Xy(d, a, n);
  h.length && (r.customDecorations = h);
  let f = [], p = 0, g = 0;
  for (; p < i.length && g < u.length; ) {
    let _ = i[p], C = u[g], { startIndex: S } = _, { startIndex: T } = C;
    S === T ? (f.push(j.deepMerge(_, C)), p++, g++) : S < T ? (f.push(j.deepClone(_)), p++) : (f.push(j.deepClone(C)), g++);
  }
  return p < i.length && f.push(...i.slice(p)), g < u.length && f.push(...u.slice(g)), f.length && (r.paragraphs = f), r;
}
function Qy(t) {
  let { body: e } = t;
  if (e == null) return !0;
  let { textRuns: n, paragraphs: r, customRanges: s, customBlocks: i, customDecorations: o, tables: a } = e;
  return n == null && r == null && s == null && i == null && o == null && a == null;
}
var mr = class {
  constructor(t) {
    this._actions = t, y(this, "_index", 0), y(this, "_offset", 0);
  }
  hasNext() {
    return this.peekLength() < 1 / 0;
  }
  next(t) {
    t || (t = 1 / 0);
    let e = this._actions[this._index];
    if (e) {
      let n = this._offset, r = e.len;
      return t >= r - n ? (t = r - n, this._index += 1, this._offset = 0) : this._offset += t, e.t === x.DELETE || e.t === x.RETAIN && e.body == null ? j.deepClone({ ...e, len: t }) : j.deepClone({ ...e, len: t, body: Xe(e.body, n, n + t, !1) });
    } else return { t: x.RETAIN, len: 1 / 0 };
  }
  peek() {
    return this._actions[this._index];
  }
  peekLength() {
    return this._actions[this._index] ? this._actions[this._index].len - this._offset : 1 / 0;
  }
  peekType() {
    let t = this._actions[this._index];
    return t ? t.t : x.RETAIN;
  }
  rest() {
    if (!this.hasNext()) return [];
    if (this._offset === 0) return this._actions.slice(this._index);
    {
      let t = this._offset, e = this._index, n = this.next(), r = this._actions.slice(this._index);
      return this._offset = t, this._index = e, [n].concat(r);
    }
  }
};
function Jy(t, e, n) {
  let { dataStream: r } = t, s = n, i = n + e, o = Cd(t, e, n), a = Rd(t, e, n), l = bd(t, e, n), u = Id(t, e, n), c = Td(t, e, n), d = Dy(t, e, n), h = My(t, e, n), f = "";
  return r && (t.dataStream = py(r, s, i), f = r.slice(s, i)), { dataStream: f, textRuns: o, paragraphs: a, sectionBreaks: l, customBlocks: u, tables: c, customRanges: d, customDecorations: h };
}
function Zy(t, e, n, r) {
  t.dataStream = fy(t.dataStream, r, e.dataStream), gd(t, e, n, r), md(t, e, n, r), _d(t, e, n, r), yd(t, e, n, r), Ed(t, e, n, r), Ay(t, e, n, r), Ny(t, e, n, r);
}
function qy(t, e, n, r, s = ft.COVER) {
  return xy(t, e, n, r, s);
}
function tE(t, e, n) {
  return e <= 0 ? { dataStream: "" } : Jy(t, e, n);
}
function eE(t, e, n, r) {
  n !== 0 && Zy(t, e, n, r);
}
function nE(t, e) {
  let n = new ur();
  return n.reset(), e.forEach((r) => {
    let s = j.deepClone(r);
    switch (s.t) {
      case x.RETAIN: {
        let { coverType: i, body: o, len: a } = s;
        o != null && qy(t, o, a, n.cursor, i), n.moveCursor(a);
        break;
      }
      case x.INSERT: {
        let { body: i, len: o } = s;
        eE(t, i, o, n.cursor), n.moveCursor(o);
        break;
      }
      case x.DELETE: {
        let { len: i } = s;
        tE(t, i, n.cursor);
        break;
      }
      default:
        throw Error(`Unknown action type for action: ${s}.`);
    }
  }), t;
}
var ie = function(t) {
  return t[t.COVER = 0] = "COVER", t[t.COVER_ONLY_NOT_EXISTED = 1] = "COVER_ONLY_NOT_EXISTED", t;
}(ie || {});
function rE(t, e, n, r, s) {
  if (t == null || e == null) return e;
  if (t.length === 0 || e.length === 0) return [];
  e = j.deepClone(e), t = j.deepClone(t);
  let i = [], o = e.length, a = t.length, l = 0, u = 0, c = null;
  function d() {
    return c ? (i.push(c), c = null, !0) : !1;
  }
  for (; l < o && u < a; ) {
    let { st: g, ed: _, ts: C } = e[l], { st: S, ed: T, ts: w, sId: E } = t[u], v = {};
    if (s === ie.COVER) v = { ...C }, n === ft.COVER && r === ft.REPLACE && w && (v = Object.assign({}, w, v));
    else if (v = { ...C }, n === ft.REPLACE) {
      if (r === ft.REPLACE) v = { ...w };
      else if (C && w) {
        let R = Object.keys(C);
        for (let I of R) w[I] && delete v[I];
      }
    } else if (r === ft.REPLACE) {
      if (w) {
        let R = Object.keys(w);
        for (let I of R) w[I] !== void 0 && (v[I] = w[I]);
      }
    } else if (w) {
      let R = Object.keys(w);
      for (let I of R) v[I] !== void 0 && delete v[I];
    }
    if (_ < S) d() || i.push(e[l]), l++;
    else if (T < g) d() || i.push(t[u]), u++;
    else {
      let R = { st: Math.min(g, S), ed: Math.max(g, S), ts: g < S ? { ...C } : { ...w } };
      R.ed > R.st && i.push(), i.push({ st: Math.max(g, S), ed: Math.min(_, T), ts: v, sId: E }), _ < T ? (l++, t[u].st = _, t[u].st === t[u].ed && u++) : (u++, e[l].st = T, e[l].st === e[l].ed && l++);
      let I = { st: Math.min(_, T), ed: Math.max(_, T), ts: _ < T ? { ...w } : { ...C }, sId: _ < T ? E : void 0 };
      c = I.ed > I.st ? I : null;
    }
  }
  d();
  let h = i[i.length - 1], f = e[o - 1], p = t[a - 1];
  return h.ed !== Math.max(f.ed, p.ed) && (f.ed > p.ed ? i.push(f) : i.push(p)), qs(i, !0);
}
function sE(t, e, n, r, s) {
  if (t == null || e == null) return e;
  if (t.length === 0 || e.length === 0) return [];
  if (t.length > 1 || e.length > 1) throw Error("CustomRanges is only supported transform for length one now.");
  let i = t[0], o = e[0];
  if (n === ft.REPLACE) return s === ie.COVER_ONLY_NOT_EXISTED ? [j.deepClone(i)] : [j.deepClone(o)];
  if (r === ft.REPLACE) {
    let a = j.deepClone(o);
    return s === ie.COVER_ONLY_NOT_EXISTED && Object.assign(a, j.deepClone(i)), [a];
  } else {
    let a = j.deepClone(o);
    return s === ie.COVER_ONLY_NOT_EXISTED && Object.assign(a, j.deepClone(i)), [a];
  }
}
function au(t, e, n, r, s) {
  let i = { startIndex: e.startIndex };
  if (e.paragraphStyle && (i.paragraphStyle = j.deepClone(e.paragraphStyle), t.paragraphStyle)) {
    if (n === ft.REPLACE) if (r === ft.REPLACE) s === ie.COVER_ONLY_NOT_EXISTED && (i.paragraphStyle = { ...t.paragraphStyle });
    else if (s === ie.COVER_ONLY_NOT_EXISTED) {
      let o = Object.keys(t.paragraphStyle);
      for (let a of o) t.paragraphStyle[a] !== void 0 && (i.paragraphStyle[a] = t.paragraphStyle[a]);
    } else {
      let o = Object.keys(t.paragraphStyle);
      for (let a of o) i.paragraphStyle[a] === void 0 && (i.paragraphStyle[a] = t.paragraphStyle[a]);
    }
    else if (r === ft.REPLACE) if (s === ie.COVER_ONLY_NOT_EXISTED) {
      let o = Object.keys(t.paragraphStyle);
      for (let a of o) t.paragraphStyle[a] !== void 0 && (i.paragraphStyle[a] = t.paragraphStyle[a]);
    } else {
      let o = Object.keys(t.paragraphStyle);
      for (let a of o) i.paragraphStyle[a] === void 0 && (i.paragraphStyle[a] = t.paragraphStyle[a]);
    }
    else if (s === ie.COVER_ONLY_NOT_EXISTED) {
      let o = Object.keys(t.paragraphStyle);
      for (let a of o) i.paragraphStyle[a] && delete i.paragraphStyle[a];
    }
  }
  return n === ft.REPLACE && r === ft.REPLACE ? i.bullet = s === ie.COVER_ONLY_NOT_EXISTED ? j.deepClone(t.bullet) : j.deepClone(e.bullet) : t.bullet === void 0 ? i.bullet = j.deepClone(e.bullet) : n === ft.REPLACE || r === ft.REPLACE ? i.bullet = s === ie.COVER && e.bullet ? j.deepClone(e.bullet) : j.deepClone(t.bullet) : s === ie.COVER && e.bullet !== void 0 && (i.bullet = j.deepClone(e.bullet)), i;
}
function iE(t, e) {
  if (t == null || e == null) return e;
  if (t.length === 0 || e.length === 0) return j.deepClone(e);
  let n = [];
  for (let r of e) {
    let { id: s, type: i } = r, o = !1;
    for (let a of t) if (a.id === s) {
      (a.type === Mr.DELETED || i === Mr.DELETED) && (o = !0, n.push({ ...r, type: Mr.DELETED }));
      break;
    }
    o || n.push(r);
  }
  return n;
}
function oE(t, e, n = !1) {
  let { body: r, coverType: s = ft.COVER } = t, { body: i, coverType: o = ft.COVER } = e;
  if (r == null || r.dataStream !== "" || i == null || i.dataStream !== "") throw Error("Data stream is not supported in retain transform.");
  let a = { dataStream: "" }, l = o, { textRuns: u, paragraphs: c = [], customRanges: d, customDecorations: h } = r, { textRuns: f, paragraphs: p = [], customRanges: g, customDecorations: _ } = i, C = rE(u, f, s, o, n ? ie.COVER_ONLY_NOT_EXISTED : ie.COVER);
  C && (a.textRuns = C);
  let S = sE(d, g, s, o, n ? ie.COVER_ONLY_NOT_EXISTED : ie.COVER);
  S && (a.customRanges = S);
  let T = iE(h, _);
  T && (a.customDecorations = T);
  let w = [], E = 0, v = 0;
  for (; E < c.length && v < p.length; ) {
    let R = c[E], I = p[v], { startIndex: A } = R, { startIndex: L } = I;
    if (A === L) {
      let N = { startIndex: A };
      N = n ? au(R, I, s, o, ie.COVER_ONLY_NOT_EXISTED) : au(R, I, s, o, ie.COVER), w.push(N), E++, v++;
    } else A < L ? E++ : (w.push(j.deepClone(I)), v++);
  }
  return v < p.length && w.push(...p.slice(v)), w.length && (a.paragraphs = w), { coverType: l, body: a };
}
function lu(t) {
  return Object.keys(t).length === 1;
}
var Tt = class Ji {
  constructor() {
    y(this, "_actions", []);
  }
  static apply(e, n) {
    return nE(e, n);
  }
  static compose(e, n) {
    let r = new mr(e), s = new mr(n), i = new Ji();
    for (; r.hasNext() || s.hasNext(); ) if (s.peekType() === x.INSERT) i.push(s.next());
    else if (r.peekType() === x.DELETE) i.push(r.next());
    else {
      let o = Math.min(r.peekLength(), s.peekLength()), a = r.next(o), l = s.next(o);
      if (a.t === x.INSERT && l.t === x.RETAIN) l.body == null ? i.push(a) : i.push({ ...a, body: ou(a.body, l.body, l.coverType) });
      else if (a.t === x.RETAIN && l.t === x.RETAIN) if (a.body == null && l.body == null) i.push(a.len === 1 / 0 ? l : a);
      else if (a.body && l.body) {
        let u = a.coverType === ft.REPLACE || l.coverType === ft.REPLACE ? ft.REPLACE : ft.COVER;
        i.push({ ...a, t: x.RETAIN, coverType: u, body: ou(a.body, l.body, l.coverType) });
      } else i.push(a.body ? a : l);
      else a.t === x.RETAIN && l.t === x.DELETE ? i.push(l) : a.t === x.INSERT && (l.t, x.DELETE);
    }
    return i.trimEndUselessRetainAction(), i.serialize();
  }
  static transform(e, n, r = "right") {
    return this._transform(n, e, r === "left" ? "right" : "left");
  }
  static _transform(e, n, r = "right") {
    let s = new mr(e), i = new mr(n), o = new Ji();
    for (; s.hasNext() || i.hasNext(); ) if (s.peekType() === x.INSERT && (r === "left" || i.peekType() !== x.INSERT)) {
      let a = s.next();
      o.retain(a.len);
    } else if (i.peekType() === x.INSERT) o.push(i.next());
    else {
      let a = Math.min(s.peekLength(), i.peekLength()), l = s.next(a), u = i.next(a);
      if (l.t === x.DELETE) continue;
      if (u.t === x.DELETE) {
        o.push(u);
        continue;
      }
      if (l.body == null || u.body == null) o.push(u);
      else {
        let { coverType: c, body: d } = oE(l, u, r === "left");
        o.push({ ...u, t: x.RETAIN, coverType: c, body: d });
      }
    }
    return o.trimEndUselessRetainAction(), o.serialize();
  }
  static transformPosition(e, n, r = !1) {
    let s = new mr(e), i = 0;
    for (; s.hasNext() && i <= n; ) {
      let o = s.peekLength(), a = s.peekType();
      if (s.next(), a === x.DELETE) {
        n -= Math.min(o, n - i);
        continue;
      } else a === x.INSERT && (i < n || !r) && (n += o);
      i += o;
    }
    return n;
  }
  static isNoop(e) {
    return e.length === 0;
  }
  static invert(e) {
    let n = [];
    for (let r of e) if (r.t === x.INSERT) n.push({ t: x.DELETE, len: r.len, body: r.body });
    else if (r.t === x.DELETE) {
      if (r.body == null) throw Error("Can not invert DELETE action without body property, makeInvertible must be called first.");
      n.push({ t: x.INSERT, body: r.body, len: r.len });
    } else if (r.body != null) {
      if (r.oldBody == null) throw Error("Can not invert RETAIN action without oldBody property, makeInvertible must be called first.");
      n.push({ t: x.RETAIN, body: r.oldBody, oldBody: r.body, len: r.len, coverType: ft.REPLACE });
    } else n.push(r);
    return n;
  }
  static makeInvertible(e, n) {
    let r = [], s = 0;
    for (let i of e) {
      if (i.t === x.DELETE && (i.body == null || i.body && i.body.dataStream.length !== i.len)) {
        let o = Xe(n, s, s + i.len, !1);
        i.len = o.dataStream.length, i.body = o;
      }
      if (i.t === x.RETAIN && i.body != null) {
        let o = Xe(n, s, s + i.len, !0);
        i.oldBody = { ...o, dataStream: "" }, i.len = o.dataStream.length;
      }
      r.push(i), i.t !== x.INSERT && (s += i.len);
    }
    return r;
  }
  insert(e, n) {
    let r = { t: x.INSERT, body: n, len: e };
    return this.push(r), this;
  }
  retain(e, n, r) {
    let s = { t: x.RETAIN, len: e };
    return n != null && (s.body = n), r != null && (s.coverType = r), this.push(s), this;
  }
  delete(e) {
    let n = { t: x.DELETE, len: e };
    return this.push(n), this;
  }
  empty() {
    return this._actions = [], this;
  }
  serialize() {
    return this._actions;
  }
  push(...e) {
    if (e.length > 1) {
      for (let i of e) this.push(i);
      return this;
    }
    let n = this._actions.length, r = this._actions[n - 1], s = j.deepClone(e[0]);
    if (s.t === x.RETAIN && s.len === 0 && s.body == null) return this;
    if (typeof r == "object") {
      if (r.t === x.DELETE && s.t === x.DELETE) return r.len += s.len, this;
      if (r.t === x.DELETE && s.t === x.INSERT && (--n, r = this._actions[n - 1], r == null)) return this._actions.unshift(s), this;
      if (r.t === x.RETAIN && s.t === x.RETAIN && r.body == null && s.body == null) return r.len += s.len, this;
      if (r.t === x.INSERT && lu(r.body) && s.t === x.INSERT && lu(s.body)) return r.len += s.len, r.body.dataStream += s.body.dataStream, this;
    }
    return n === this._actions.length ? this._actions.push(s) : this._actions.splice(n, 0, s), this;
  }
  trimEndUselessRetainAction() {
    let e = this._actions[this._actions.length - 1];
    for (; e && e.t === x.RETAIN && Qy(e); ) this._actions.pop(), e = this._actions[this._actions.length - 1];
    return this;
  }
};
y(Tt, "id", "text-x"), y(Tt, "uri", "https://github.com/dream-num/univer#text-x"), Object.defineProperty(Tt, "name", { value: "text-x" });
var an = class wd {
  static registerSubtype(e) {
    var n;
    e == null || this._subTypes.has(e.name) && ((n = this._subTypes.get(e.name)) == null ? void 0 : n.id) !== Tt.id || (this._subTypes.set(e.name, e), fe.type.registerSubtype(e));
  }
  static apply(e, n) {
    if (!fe.type.isNoop(n)) return fe.type.apply(e, n);
  }
  static compose(e, n) {
    return fe.type.compose(e, n);
  }
  static transform(e, n, r) {
    return fe.type.transform(e, n, r);
  }
  static transformPosition(e, n, r = "right") {
    return e && e.length === 2 && e[0] === "body" && e[1].et === Tt.name ? Tt.transformPosition(e[1].e, n, r === "left") : n;
  }
  static invertWithDoc(e, n) {
    return fe.type.invertWithDoc(e, n);
  }
  static isNoop(e) {
    return fe.type.isNoop(e);
  }
  static getInstance() {
    return this._instance == null && (this._instance = new wd()), this._instance;
  }
  removeOp(e, n) {
    return fe.removeOp(e, n);
  }
  moveOp(e, n) {
    return fe.moveOp(e, n);
  }
  insertOp(e, n) {
    return fe.insertOp(e, n);
  }
  replaceOp(e, n, r) {
    return fe.replaceOp(e, n, r);
  }
  editOp(e, n = ["body"]) {
    return fe.editOp(n, Tt.name, e);
  }
};
y(an, "uri", "https://github.com/dream-num/univer#json-x"), y(an, "_subTypes", /* @__PURE__ */ new Map()), y(an, "_instance", null), an.registerSubtype(Tt);
let N1 = function(t) {
  return t.PARAGRAPH = "PARAGRAPH", t.SECTION_BREAK = "SECTION_BREAK", t.TABLE = "TABLE", t.TABLE_ROW = "TABLE_ROW", t.TABLE_CELL = "TABLE_CELL", t.CUSTOM_BLOCK = "CUSTOM_BLOCK", t;
}({}), Ae = function(t) {
  return t.PARAGRAPH = "\r", t.SECTION_BREAK = `
`, t.TABLE_START = "", t.TABLE_ROW_START = "\x1B", t.TABLE_CELL_START = "", t.TABLE_CELL_END = "", t.TABLE_ROW_END = "", t.TABLE_END = "", t.CUSTOM_RANGE_START = "", t.CUSTOM_RANGE_END = "", t.COLUMN_BREAK = "\v", t.PAGE_BREAK = "\f", t.DOCS_END = "\0", t.TAB = "	", t.CUSTOM_BLOCK = "\b", t.LETTER = "", t.SPACE = " ", t;
}({});
function D1(t) {
  return `${t}`;
}
const aE = [Ae.TABLE_START, Ae.TABLE_ROW_START, Ae.TABLE_CELL_START, Ae.TABLE_CELL_END, Ae.TABLE_ROW_END, Ae.TABLE_END], Da = (t) => {
  let e = t.endsWith(`\r
`) ? t.slice(0, -2) : t;
  return aE.reduce((n, r) => n.replaceAll(r, ""), e);
}, lE = (t) => t ? Da(t).replaceAll("\r", "") === "" : !0, uE = (t) => {
  let e = t.replace(/\n/g, "\r"), n = [], r = [], s = 0, i = "", o = (l, u = !0) => {
    let c = e.slice(s, l);
    if (j.isLegalUrl(c)) {
      let d = ce(), h = `${c}`, f = { startIndex: s, endIndex: s + h.length - 1, rangeId: d, rangeType: qn.HYPERLINK, properties: { url: t } };
      r.push(f), i += h, s = l + 1, u && (i += "\r", n.push({ startIndex: l }));
    } else i += e.slice(s, l + 1), s = l + 1, u && n.push({ startIndex: l });
  }, a = 0;
  for (let l = 0; l < e.length; l++) e[l] === "\r" && (o(l), a = l);
  return (a !== e.length - 1 || e.length === 1) && o(e.length, !1), { dataStream: i, paragraphs: n, customRanges: r };
}, Od = { id: "default_doc", documentStyle: {} };
var cE = class extends ba {
  getUnitId() {
    throw Error("Method not implemented.");
  }
  constructor(t) {
    var e;
    super(), y(this, "type", Et.UNIVER_DOC), y(this, "_name$", new de("")), y(this, "name$", this._name$.asObservable()), y(this, "snapshot", void 0), this.snapshot = { ...Od, ...t }, this._name$.next((e = this.snapshot.title) == null ? "No Title" : e);
  }
  getRev() {
    var t;
    return (t = this.snapshot.rev) == null ? 1 : t;
  }
  incrementRev() {
    this.snapshot.rev = this.getRev() + 1;
  }
  setRev(t) {
    this.snapshot.rev = t;
  }
  setName(t) {
    this.snapshot.title = t, this._name$.next(t);
  }
  get drawings() {
    return this.snapshot.drawings;
  }
  get documentStyle() {
    return this.snapshot.documentStyle;
  }
  get lists() {
    return this.snapshot.lists;
  }
  get zoomRatio() {
    var t;
    return ((t = this.snapshot.settings) == null ? void 0 : t.zoomRatio) || 1;
  }
  resetDrawing(t, e) {
    this.snapshot.drawings = t, this.snapshot.drawingsOrder = e;
  }
  getBody() {
    return this.snapshot.body;
  }
  getSnapshot() {
    return this.snapshot;
  }
  getBulletPresetList() {
    var t;
    let e = (t = this.snapshot.lists) == null ? {} : t;
    return { ...ti, ...e };
  }
  updateDocumentId(t) {
    this.snapshot.id = t;
  }
  updateDocumentRenderConfig(t) {
    let { documentStyle: e } = this.snapshot;
    e.renderConfig == null ? e.renderConfig = t : e.renderConfig = { ...e.renderConfig, ...t };
  }
  getDocumentStyle() {
    return this.snapshot.documentStyle;
  }
  updateDocumentStyle(t) {
    this.snapshot.documentStyle == null ? this.snapshot.documentStyle = t : this.snapshot.documentStyle = { ...this.snapshot.documentStyle, ...t };
  }
  updateDocumentDataMargin(t) {
    let { t: e, l: n, b: r, r: s } = t, { documentStyle: i } = this.snapshot;
    e != null && (i.marginTop = e), n != null && (i.marginLeft = n), r != null && (i.marginBottom = r), s != null && (i.marginRight = s);
  }
  updateDocumentDataPageSize(t, e) {
    let { documentStyle: n } = this.snapshot;
    if (!n.pageSize) {
      n.pageSize = { width: t ?? 1 / 0, height: e ?? 1 / 0 };
      return;
    }
    t !== void 0 && (n.pageSize.width = t), e !== void 0 && (n.pageSize.height = e);
  }
  updateDrawing(t, e) {
    let { drawings: n } = this, { width: r, height: s, left: i, top: o } = e, a = n == null ? void 0 : n[t];
    if (!a) return;
    let l = a.docTransform;
    l.size.width = r, l.size.height = s, l.positionH.posOffset = i, l.positionV.posOffset = o;
  }
  setZoomRatio(t = 1) {
    this.snapshot.settings ? this.snapshot.settings.zoomRatio = t : this.snapshot.settings = { zoomRatio: t };
  }
  setDisabled(t) {
    this.snapshot.disabled = t;
  }
  getDisabled() {
    return this.snapshot.disabled;
  }
  getTitle() {
    return this.snapshot.title;
  }
}, xn = class Zi extends cE {
  constructor(e) {
    var n, r;
    super(j.isEmptyObject(e) ? N_() : e), y(this, "_unitId", void 0), y(this, "headerModelMap", /* @__PURE__ */ new Map()), y(this, "footerModelMap", /* @__PURE__ */ new Map()), y(this, "change$", new de(0)), this._unitId = (n = this.snapshot.id) == null ? ce(6) : n, this._initializeHeaderFooterModel(), this._name$.next((r = this.snapshot.title) == null ? "" : r);
  }
  dispose() {
    super.dispose(), this.headerModelMap.forEach((e) => {
      e.dispose();
    }), this.footerModelMap.forEach((e) => {
      e.dispose();
    }), this._name$.complete();
  }
  getDrawings() {
    return this.snapshot.drawings;
  }
  getDrawingsOrder() {
    return this.snapshot.drawingsOrder;
  }
  getCustomRanges() {
    var e;
    return (e = this.snapshot.body) == null ? void 0 : e.customRanges;
  }
  getCustomDecorations() {
    var e;
    return (e = this.snapshot.body) == null ? void 0 : e.customDecorations;
  }
  getSettings() {
    return this.snapshot.settings;
  }
  reset(e) {
    if (e.id && e.id !== this._unitId) throw Error("Cannot reset a document model with a different unit id!");
    this.snapshot = { ...Od, ...e }, this._initializeHeaderFooterModel(), this.change$.next(this.change$.value + 1);
  }
  getSelfOrHeaderFooterModel(e) {
    if (e != null) {
      if (this.headerModelMap.has(e)) return this.headerModelMap.get(e);
      if (this.footerModelMap.has(e)) return this.footerModelMap.get(e);
    }
    return this;
  }
  getUnitId() {
    return this._unitId;
  }
  apply(e) {
    if (!an.isNoop(e)) return this.snapshot = an.apply(this.snapshot, e), e != null && e.some((n) => Array.isArray(n) && ((n == null ? void 0 : n[0]) === "headers" || (n == null ? void 0 : n[0]) === "footers")) && (this.headerModelMap.clear(), this.footerModelMap.clear(), this._initializeHeaderFooterModel()), this.change$.next(this.change$.value + 1), this.snapshot;
  }
  sliceBody(e, n, r = Xi.copy) {
    let s = this.getBody();
    if (s != null) return Xe(s, e, n, !1, r);
  }
  _initializeHeaderFooterModel() {
    let { headers: e, footers: n } = this.getSnapshot();
    if (e) for (let r in e) {
      let s = e[r];
      this.headerModelMap.set(r, new Zi(s)), this.headerModelMap.get(r).updateDocumentId(this.getUnitId());
    }
    if (n) for (let r in n) {
      let s = n[r];
      this.footerModelMap.set(r, new Zi(s)), this.footerModelMap.get(r).updateDocumentId(this.getUnitId());
    }
  }
  updateDocumentId(e) {
    super.updateDocumentId(e), this._unitId = e;
  }
  getPlainText() {
    var e, n;
    return Da((e = (n = this.getBody()) == null ? void 0 : n.dataStream) == null ? "" : e);
  }
};
function dE(t) {
  let { ranges: e, id: n, type: r } = t, s = new Tt(), i = 0;
  for (let o = 0; o < e.length; o++) {
    let { startOffset: a, endOffset: l } = e[o];
    a > 0 && s.push({ t: x.RETAIN, len: a - i }), s.push({ t: x.RETAIN, body: { dataStream: "", customDecorations: [{ id: n, type: r, startIndex: 0, endIndex: l - a - 1 }] }, len: l - a }), i = l;
  }
  return s;
}
function hE(t) {
  var e;
  let { id: n, segmentId: r, documentDataModel: s } = t, i = s == null ? void 0 : s.getBody();
  if (!s || !i) return !1;
  let o = (e = s.getSelfOrHeaderFooterModel(r)) == null || (e = e.getBody()) == null || (e = e.customDecorations) == null ? void 0 : e.find((d) => d.id === n);
  if (!o) return !1;
  let a = new Tt(), { startIndex: l, endIndex: u } = o, c = u - l + 1;
  return a.push({ t: x.RETAIN, len: l }), a.push({ t: x.RETAIN, len: c, body: { dataStream: "", customDecorations: [{ startIndex: 0, endIndex: c - 1, id: n, type: Mr.DELETED }] } }), a;
}
function Ad(t, e, n, r) {
  return t <= n && e >= n || t >= n && t <= r;
}
function fE(t, e) {
  let n = [];
  for (let r = 0, s = e.length; r < s; r++) {
    let i = e[r];
    t.collapsed ? i.startIndex < t.startOffset && t.startOffset <= i.endIndex && n.push(i) : Ad(t.startOffset, t.endOffset - 1, i.startIndex, i.endIndex) && n.push(i);
  }
  return n;
}
function pE(t) {
  return { ...j.deepClone(t), rangeId: ce() };
}
function gE(t, e) {
  let n = [], r = t[0];
  for (let s of e) s < t[0] || s > t[1] || (r < s && n.push([r, s - 1]), r = s + 1);
  return r <= t[1] && n.push([r, t[1]]), n;
}
function Nd(t, e, n, r) {
  let s = [];
  for (let i = 0, o = n.length; i < o; i++) {
    let a = n[i];
    if ((r === void 0 || a.rangeType === r) && Math.max(a.startIndex, t) <= Math.min(a.endIndex, e) && s.push({ ...a }), a.startIndex > e) break;
  }
  return s;
}
function mE(t, e) {
  var n, r, s, i, o;
  let a = Nd(t.startOffset, t.collapsed ? t.startOffset : t.endOffset - 1, (n = e.customRanges) == null ? [] : n), l = Math.min(t.startOffset, (r = (s = a[0]) == null ? void 0 : s.startIndex) == null ? 1 / 0 : r), u = Math.max(t.endOffset, ((i = (o = a[a.length - 1]) == null ? void 0 : o.endIndex) == null ? -1 / 0 : i) + 1);
  return { startOffset: l, endOffset: u, collapsed: l === u };
}
function _E(t) {
  var e, n;
  let { rangeId: r, segmentId: s, documentDataModel: i, insert: o } = t, a = (e = i.getSelfOrHeaderFooterModel(s).getBody()) == null || (e = e.customRanges) == null ? void 0 : e.find((f) => f.rangeId === r);
  if (!a) return !1;
  let { startIndex: l, endIndex: u } = a, c = new Tt(), d = u - l + 1;
  c.push({ t: x.RETAIN, len: l }), c.push({ t: x.RETAIN, len: d, body: { dataStream: "", customRanges: [] } }), o && c.push({ t: x.INSERT, body: o, len: o.dataStream.length });
  let h = u + 1 + ((n = o == null ? void 0 : o.dataStream.length) == null ? 0 : n);
  return c.selections = [{ startOffset: h, endOffset: h, collapsed: !0 }], c;
}
function yE(t) {
  let { ranges: e, rangeId: n, rangeType: r, wholeEntity: s, properties: i, body: o } = t, a = 0, l = new Tt(), u = !1;
  return e.forEach((c) => {
    var d, h, f;
    let p = mE(c, o);
    if (!p || !o) return !1;
    let { startOffset: g, endOffset: _ } = p, C = (d = o.customRanges) == null ? [] : d, S = (E, v, R) => {
      var I, A, L, N;
      let ut = Nd(E, v, C, r), ct = Math.min((I = (A = ut[0]) == null ? void 0 : A.startIndex) == null ? 1 / 0 : I, E), st = Math.max((L = (N = ut[ut.length - 1]) == null ? void 0 : N.endIndex) == null ? -1 / 0 : L, v), K = { rangeId: R ? `${n}$${R}` : n, rangeType: r, startIndex: 0, endIndex: st - ct, wholeEntity: s, properties: { ...i } };
      l.push({ t: x.RETAIN, len: ct - a }), l.push({ t: x.RETAIN, len: st - ct + 1, body: { dataStream: "", customRanges: [K] }, coverType: ft.COVER }), a = st + 1;
    }, T = ((h = o.paragraphs) == null ? [] : h).filter((E) => E.startIndex < _ && E.startIndex > g), w = ((f = o.customBlocks) == null ? [] : f).filter((E) => E.startIndex < _ && E.startIndex > g);
    gE([g, _ - 1], [...T.map((E) => E.startIndex), ...w.map((E) => E.startIndex)]).forEach(([E, v], R) => S(E, v, R)), u = !0, l.selections = [{ startOffset: p.endOffset, endOffset: p.endOffset, collapsed: !0 }];
  }), u ? l : !1;
}
function Dd(t, e, n = 0, r = null, s = !0) {
  t.sort((u, c) => u.startOffset - c.startOffset);
  let i = [], { paragraphs: o = [] } = e, a = o == null ? void 0 : o.find((u) => u.startIndex >= t[0].startOffset && u.startIndex < t[0].endOffset), l = n;
  if (t.forEach((u) => {
    let { startOffset: c, endOffset: d } = u;
    c > l && (i.push({ t: x.RETAIN, len: c - l }), l = c), l < d && (i.push({ t: x.DELETE, len: d - l }), l = d);
  }), r && i.push({ t: x.INSERT, body: r, len: r.dataStream.length }), a && s) {
    let u = o.find((c) => c.startIndex - n >= t[t.length - 1].endOffset - 1);
    u && (u.startIndex > l && (i.push({ t: x.RETAIN, len: u.startIndex - l }), l = u.startIndex), i.push({ t: x.RETAIN, len: 1, body: { dataStream: "", paragraphs: [{ ...u, startIndex: 0, bullet: a == null ? void 0 : a.bullet }] }, coverType: ft.REPLACE }));
  }
  return i;
}
function EE(t, e, n = 0) {
  let r = [], s = n;
  return t.forEach((i) => {
    let { startOffset: o, endOffset: a } = i;
    o > s && (r.push({ t: x.RETAIN, len: o - s }), s = o), a > s && (r.push({ t: x.RETAIN, len: a - s, body: { ...j.deepClone(e), dataStream: "" } }), s = a);
  }), r;
}
const vE = (t) => {
  var e;
  let { selection: n, body: r, doc: s } = t, i = n.segmentId, o = (e = s.getSelfOrHeaderFooterModel(i)) == null ? void 0 : e.getBody();
  if (!o) return !1;
  let a = n.collapsed ? null : Xe(o, n.startOffset, n.endOffset), l = Qc(a ? a.dataStream : "", r.dataStream), u = 0, c = l.map(([h, f]) => {
    switch (h) {
      case 0: {
        let p = { t: x.RETAIN, body: { ...Xe(r, u, u + f.length, !1), dataStream: "" }, len: f.length };
        return u += f.length, p;
      }
      case 1: {
        let p = { t: x.INSERT, body: Xe(r, u, u + f.length), len: f.length };
        return u += f.length, p;
      }
      default:
        return { t: x.DELETE, len: f.length };
    }
  }), d = new Tt();
  return d.push({ t: x.RETAIN, len: n.startOffset }), d.push(...c), d;
};
function CE(t, e) {
  return !!((t == null ? void 0 : t.length) === (e == null ? void 0 : e.length) && t != null && t.every((n, r) => JSON.stringify(n) === JSON.stringify(e == null ? void 0 : e[r])));
}
const RE = (t) => {
  var e;
  let { selection: n, body: r, doc: s, themeService: i } = t, o = n.segmentId, a = (e = s.getSelfOrHeaderFooterModel(o)) == null ? void 0 : e.getBody();
  if (!a) return !1;
  let l = n.collapsed ? null : Xe(a, n.startOffset, n.endOffset), u = Qc(l ? l.dataStream : "", r.dataStream), c = 0, d = u.map(([f, p]) => {
    switch (f) {
      case 0: {
        let g = Qi(r, c, c + p.length, !1), _ = Qi(l, c, c + p.length, !1), C = { t: x.RETAIN, body: CE(g, _) ? void 0 : { textRuns: g == null ? void 0 : g.map((S) => {
          var T, w, E, v;
          return { ...S, ts: { ...S.ts, cl: !((T = S.ts) == null || (T = T.cl) == null || (T = T.rgb) == null) && T.includes(".") ? { rgb: i.getColorFromTheme((w = (E = S.ts) == null || (E = E.cl) == null ? void 0 : E.rgb) == null ? "" : w) } : (v = S.ts) == null ? void 0 : v.cl } };
        }), dataStream: "" }, len: p.length };
        return c += p.length, C;
      }
      case 1: {
        let g = { t: x.INSERT, body: Xe(r, c, c + p.length), len: p.length };
        return c += p.length, g;
      }
      default:
        return { t: x.DELETE, len: p.length };
    }
  });
  if (d.every((f) => f.t === x.RETAIN && !f.body)) return !1;
  let h = new Tt();
  return h.push({ t: x.RETAIN, len: n.startOffset }), h.push(...d), h;
};
function bE(t, e) {
  let n = [], { customBlocks: r = [] } = t;
  for (let s of e) {
    let { startOffset: i, endOffset: o } = s;
    if (!(i == null || o == null)) for (let a of r) {
      let { startIndex: l } = a;
      l >= i && l < o && n.push(a.blockId);
    }
  }
  return n;
}
function IE(t, e = "") {
  if (!e) return ["body"];
  let { headers: n, footers: r } = t.getSnapshot();
  if (n == null && r == null) throw Error("Document data model must have headers or footers when update by segment id");
  if ((n == null ? void 0 : n[e]) != null) return ["headers", e, "body"];
  if ((r == null ? void 0 : r[e]) != null) return ["footers", e, "body"];
  throw Error("Segment id not found in headers or footers");
}
const TE = (t) => {
  var e, n;
  let { selection: r, documentDataModel: s, drawings: i } = t, { collapsed: o, startOffset: a, segmentId: l } = r, u = new Tt(), c = an.getInstance(), d = [], h = s.getSelfOrHeaderFooterModel(l).getBody();
  if (!h) return !1;
  let f = (e = (n = s.getSnapshot().drawingsOrder) == null ? void 0 : n.length) == null ? 0 : e, p = 0;
  if (o) a > 0 && u.push({ t: x.RETAIN, len: a });
  else {
    var g, _;
    let T = Dd([r], h, 0, null, !1);
    u.push(...T);
    let w = bE(h, [r]), E = (g = s.getDrawings()) == null ? {} : g, v = (_ = s.getDrawingsOrder()) == null ? [] : _, R = w.sort((I, A) => v.indexOf(I) > v.indexOf(A) ? -1 : v.indexOf(I) < v.indexOf(A) ? 1 : 0);
    if (R.length > 0) for (let I of R) {
      let A = E[I], L = v.indexOf(I);
      if (A == null || L < 0) continue;
      let N = c.removeOp(["drawings", I], A), ut = c.removeOp(["drawingsOrder", L], I);
      d.push(N), d.push(ut), p++;
    }
  }
  u.push({ t: x.INSERT, body: { dataStream: "\b".repeat(i.length), customBlocks: i.map((T, w) => ({ startIndex: w, blockId: T.drawingId })) }, len: i.length });
  let C = IE(s, l), S = c.editOp(u.serialize(), C);
  d.push(S);
  for (let T of i) {
    let { drawingId: w } = T, E = c.insertOp(["drawings", w], T), v = c.insertOp(["drawingsOrder", f - p], w);
    d.push(E), d.push(v);
  }
  return d.reduce((T, w) => an.compose(T, w), null);
};
function SE(t, e) {
  if (e === void 0) return { startOffset: t, endOffset: t, collapsed: !0 };
  if (e < t) throw Error(`Cannot make a doc selection when endOffset ${e} is less than startOffset ${t}.`);
  return { startOffset: t, endOffset: e, collapsed: t === e };
}
function wE(t) {
  let { startOffset: e, endOffset: n, collapsed: r } = t;
  return { startOffset: Math.min(e, n), endOffset: Math.max(e, n), collapsed: r };
}
function OE(t, e, n, r) {
  return Math.max(t, n) <= Math.min(e, r);
}
function qi(t, e, n, r) {
  let { startOffset: s, endOffset: i } = t, o = r ?? Ma(e, n), a = [], l = -1;
  for (let u = 0; u < o.length; u++) {
    let c = o[u], { startIndex: d } = c;
    (s > l && s <= d || i > l && i <= d || d >= s && d <= i) && a.push(c), l = d;
  }
  return a;
}
function to(t, e, n) {
  let r = [], s = Ma(e, n);
  for (let i of t) {
    let o = qi(i, e, n, s);
    r.push(...o);
  }
  return r;
}
const AE = [Ae.PARAGRAPH, Ae.TABLE_START, Ae.TABLE_END, Ae.TABLE_ROW_START, Ae.TABLE_CELL_START, Ae.TABLE_CELL_END];
function Ma(t, e) {
  let n = [];
  for (let r = 0; r < t.length; r++) {
    let s = t[r], { startIndex: i } = s, o = i - 1;
    for (; !AE.includes(e[o]) && o >= 0; ) o--;
    n.push({ ...s, paragraphStart: o + 1, paragraphEnd: s.startIndex });
  }
  return n;
}
const NE = (t) => {
  var e, n;
  let { paragraphs: r, segmentId: s, document: i } = t, o = t.listType, a = (e = (n = i.getSelfOrHeaderFooterModel(s).getBody()) == null ? void 0 : n.paragraphs) == null ? [] : e, l = r.every((f) => {
    var p;
    return ((p = f.bullet) == null ? void 0 : p.listType.indexOf(o)) === 0;
  }), u = ce(6);
  if (r.length === 1) {
    let f = a.indexOf(r[0]), p = a[f - 1], g = a[f + 1];
    p && p.bullet && p.bullet.listType.indexOf(o) === 0 ? (u = p.bullet.listId, o !== ot.CHECK_LIST && (o = p.bullet.listType)) : g && g.bullet && g.bullet.listType.indexOf(o) === 0 && (u = g.bullet.listId, o !== ot.CHECK_LIST && (o = g.bullet.listType));
  }
  let c = new ur();
  c.reset();
  let d = new Tt();
  for (let f of r) {
    var h;
    let { startIndex: p, paragraphStyle: g = {}, bullet: _ } = f;
    d.push({ t: x.RETAIN, len: p - c.cursor }), d.push({ t: x.RETAIN, len: 1, body: { dataStream: "", paragraphs: [l ? { paragraphStyle: g, startIndex: 0 } : { startIndex: 0, paragraphStyle: { ...g }, bullet: { nestingLevel: (h = _ == null ? void 0 : _.nestingLevel) == null ? 0 : h, textStyle: { fs: 20 }, listType: o, listId: u } }] }, coverType: ft.REPLACE }), c.moveCursorTo(p + 1);
  }
  return d;
}, DE = (t) => {
  var e;
  let { paragraphIndex: n, segmentId: r, document: s } = t, i = (e = s.getSelfOrHeaderFooterModel(r).getBody()) == null ? void 0 : e.paragraphs;
  if (i == null) return !1;
  let o = i.find((h) => h.startIndex === n);
  if (!(o != null && o.bullet) || o.bullet.listType.indexOf(ot.CHECK_LIST) === -1) return !1;
  let a = new ur();
  a.reset();
  let l = new Tt(), { startIndex: u, paragraphStyle: c = {} } = o, d = o.bullet.listType === ot.CHECK_LIST ? ot.CHECK_LIST_CHECKED : ot.CHECK_LIST;
  return l.push({ t: x.RETAIN, len: u - a.cursor }), l.push({ t: x.RETAIN, len: 1, body: { dataStream: "", paragraphs: [{ ...o, paragraphStyle: c, startIndex: 0, bullet: { ...o.bullet, listType: d } }] }, coverType: ft.REPLACE }), a.moveCursorTo(u + 1), l;
}, ME = (t) => {
  var e;
  let { paragraphs: n, listType: r, segmentId: s, document: i } = t;
  if (((e = i.getSelfOrHeaderFooterModel(s).getBody()) == null ? void 0 : e.paragraphs) == null) return !1;
  let o = ce(6), a = new ur();
  a.reset();
  let l = new Tt();
  for (let c of n) {
    var u;
    let { startIndex: d, paragraphStyle: h = {}, bullet: f } = c;
    l.push({ t: x.RETAIN, len: d - a.cursor }), l.push({ t: x.RETAIN, len: 1, body: { dataStream: "", paragraphs: [{ startIndex: 0, paragraphStyle: h, bullet: { nestingLevel: (u = f == null ? void 0 : f.nestingLevel) == null ? 0 : u, textStyle: (f == null ? void 0 : f.listType) === r ? f.textStyle : { fs: 20 }, listType: r, listId: o } }] }, coverType: ft.REPLACE }), a.moveCursorTo(d + 1);
  }
  return l;
};
function LE(t, e) {
  return e.some((n) => t.startIndex > n.startIndex && t.startIndex < n.endIndex);
}
const xE = (t) => {
  var e, n, r;
  let { paragraphs: s, document: i, type: o } = t, a = new ur();
  a.reset();
  let l = new Tt(), u = (e = i.getSnapshot().lists) == null ? {} : e, c = (n = (r = i.getBody()) == null ? void 0 : r.tables) == null ? [] : n, d = { ...ti, ...u };
  for (let h of s) {
    let { startIndex: f, paragraphStyle: p = {}, bullet: g } = h, _ = LE(h, c);
    if (l.push({ t: x.RETAIN, len: f - a.cursor }), g) {
      let C = d[g.listType].nestingLevel.length - 1;
      _ && (C = Math.min(C, 2)), l.push({ t: x.RETAIN, len: 1, body: { dataStream: "", paragraphs: [{ startIndex: 0, paragraphStyle: { ...p }, bullet: { ...g, nestingLevel: Math.max(Math.min(g.nestingLevel + o, C), 0) } }] }, coverType: ft.REPLACE });
    } else l.push({ t: x.RETAIN, len: 1 });
    a.moveCursorTo(f + 1);
  }
  return l;
}, FE = (t) => {
  var e, n, r, s;
  let { textRanges: i, segmentId: o, document: a, style: l, paragraphTextRun: u, cursor: c, deleteLen: d, textX: h } = t, f = a.getSelfOrHeaderFooterModel(o), p = to(i, (e = (n = f.getBody()) == null ? void 0 : n.paragraphs) == null ? [] : e, (r = (s = f.getBody()) == null ? void 0 : s.dataStream) == null ? "" : r), g = new ur();
  c && g.moveCursorTo(c);
  let _ = h ?? new Tt();
  p.sort((S, T) => S.startIndex - T.startIndex);
  let C = Math.max(0, p[0].paragraphStart - 1);
  C > g.cursor && (_.push({ t: x.RETAIN, len: C - g.cursor }), g.moveCursorTo(C)), d && _.push({ t: x.DELETE, len: d });
  for (let S of p) {
    let { startIndex: T, paragraphStyle: w = {} } = S, E = T - g.cursor;
    _.push({ t: x.RETAIN, len: E, ...u ? { body: { dataStream: "", textRuns: [{ ts: u, st: 0, ed: E }] }, coverType: ft.REPLACE } : null }), _.push({ t: x.RETAIN, len: 1, body: { dataStream: "", paragraphs: [{ startIndex: 0, paragraphStyle: { ...w, ...l } }] }, coverType: ft.REPLACE }), g.moveCursorTo(T + 1);
  }
  return _;
};
var oe = class {
};
y(oe, "customRange", { add: yE, delete: _E, copyCustomRange: pE, getCustomRangesInterestsWithSelection: fE, isIntersecting: Ad }), y(oe, "customDecoration", { add: dE, delete: hE }), y(oe, "selection", { replace: vE, makeSelection: SE, normalizeSelection: wE, delete: Dd, replaceTextRuns: RE, retain: EE }), y(oe, "range", { isIntersects: OE, getParagraphsInRange: qi, getParagraphsInRanges: to }), y(oe, "transform", { getPlainText: Da, fromPlainText: uE, isEmptyDocument: lE }), y(oe, "paragraph", { bullet: { set: ME, switch: NE, toggleChecklist: DE, changeNestLevel: xE }, style: { set: FE }, util: { transform: Ma, getParagraphsInRange: qi, getParagraphsInRanges: to } }), y(oe, "drawing", { add: TE });
function M1(t, e, n, r) {
  if (e === "") return t;
  let s = new xn({ id: "mock-id", body: t, documentStyle: {} }), i = e.length, o;
  for (; (o = (r ? s.getBody().dataStream : s.getBody().dataStream.toLowerCase()).indexOf(e)) >= 0; ) {
    let u = new Tt(), c = an.getInstance();
    if (o > 0 && u.retain(o), n.length > 0) {
      var a;
      let d = s.sliceBody(o, o + i), h = { dataStream: n };
      Array.isArray(d == null ? void 0 : d.textRuns) && d.textRuns.length && (h.textRuns = [{ ...d.textRuns[0], st: 0, ed: n.length }]), !(d == null || (a = d.customRanges) == null) && a.length && (h.customRanges = [{ ...d.customRanges[0], startIndex: 0, endIndex: n.length - 1 }]), u.insert(n.length, h);
    }
    u.delete(i), s.apply(c.editOp(u.serialize()));
  }
  let l = s.getBody();
  return s.dispose(), l;
}
function UE(t) {
  if (t.customRanges || (t.customRanges = []), !t.paragraphs) {
    t.paragraphs = [];
    for (let e = 0; e < t.dataStream.length; e++) t.dataStream[e] === "\r" && t.paragraphs.push({ startIndex: e });
  }
  return t.customBlocks || (t.customBlocks = []), t.textRuns || (t.textRuns = []), t.customDecorations || (t.customDecorations = []), t.sectionBreaks || (t.sectionBreaks = []), t.tables || (t.tables = []), t;
}
function Md(t) {
  var e;
  return t.body = UE((e = t.body) == null ? { dataStream: "" } : e), t.drawingsOrder || (t.drawingsOrder = []), t.drawings || (t.drawings = {}), t.documentStyle || (t.documentStyle = {}), t;
}
var Ld = class xd {
  static create(e = {}) {
    return new xd(e);
  }
  constructor(e = {}) {
    y(this, "_style", void 0), this._style = e;
  }
  get fontFamily() {
    return this._style.ff;
  }
  get fontSize() {
    return this._style.fs;
  }
  get italic() {
    return this._style.it === z.TRUE;
  }
  get bold() {
    return this._style.bl === z.TRUE;
  }
  get underline() {
    return this._style.ul && ds.create(this._style.ul);
  }
  get bottomBorderLine() {
    return this._style.bbl && ds.create(this._style.bbl);
  }
  get strikethrough() {
    return this._style.st && ds.create(this._style.st);
  }
  get overline() {
    return this._style.ol && ds.create(this._style.ol);
  }
  get background() {
    return this._style.bg;
  }
  get border() {
    return this._style.bd;
  }
  get color() {
    return this._style.cl;
  }
  get verticalAlign() {
    return this._style.va;
  }
  get numberFormat() {
    return this._style.n;
  }
  copy() {
    return bs.create(j.deepClone(this._style));
  }
  getValue() {
    return { ...this._style };
  }
}, bs = class eo extends Ld {
  static create(e = {}) {
    return new eo(e);
  }
  constructor(e = {}) {
    super(e);
  }
  setFontFamily(e) {
    return this._style.ff = e, this;
  }
  setFontSize(e) {
    return this._style.fs = e, this;
  }
  setItalic(e) {
    return this._style.it = e ? 1 : 0, this;
  }
  setBold(e) {
    return this._style.bl = e ? 1 : 0, this;
  }
  setUnderline(e) {
    return this._style.ul = e.build(), this;
  }
  setBottomBorderLine(e) {
    return this._style.bbl = e.build(), this;
  }
  setStrikethrough(e) {
    return this._style.st = e.build(), this;
  }
  setOverline(e) {
    return this._style.ol = e.build(), this;
  }
  setBackground(e) {
    return this._style.bg = e, this;
  }
  setBorder(e) {
    return this._style.bd = e, this;
  }
  setColor(e) {
    return this._style.cl = e, this;
  }
  setVerticalAlign(e) {
    return this._style.va = e, this;
  }
  copy() {
    return eo.create(j.deepClone(this._style));
  }
  build() {
    return this.getValue();
  }
}, ds = class no {
  static create(e = { s: 1 }) {
    return new no(e);
  }
  constructor(e = { s: 1 }) {
    y(this, "_decoration", void 0), this._decoration = e;
  }
  get show() {
    return this._decoration.s === z.TRUE;
  }
  get followFontColor() {
    return this._decoration.c === z.TRUE;
  }
  get color() {
    return this._decoration.cl;
  }
  get type() {
    return this._decoration.t;
  }
  setShow(e) {
    return this._decoration.s = e ? 1 : 0, this;
  }
  setFollowFontColor(e) {
    return this._decoration.c = e ? 1 : 0, this;
  }
  setColor(e) {
    return this._decoration.cl = e, this;
  }
  setLineType(e) {
    return this._decoration.t = e, this;
  }
  copy() {
    return no.create(j.deepClone(this._decoration));
  }
  build() {
    return { ...this._decoration };
  }
}, Fd = class Ud {
  static create(e = {}) {
    return new Ud(e);
  }
  constructor(e = {}) {
    y(this, "_style", void 0), this._style = e;
  }
  get indentFirstLine() {
    return this._style.indentFirstLine;
  }
  get hanging() {
    return this._style.hanging;
  }
  get indentStart() {
    return this._style.indentStart;
  }
  get tabStops() {
    return this._style.tabStops;
  }
  get indentEnd() {
    return this._style.indentEnd;
  }
  get textStyle() {
    return this._style.textStyle;
  }
  get headingId() {
    return this._style.headingId;
  }
  get namedStyleType() {
    return this._style.namedStyleType;
  }
  get horizontalAlign() {
    return this._style.horizontalAlign;
  }
  get lineSpacing() {
    return this._style.lineSpacing;
  }
  get direction() {
    return this._style.direction;
  }
  get spacingRule() {
    return this._style.spacingRule;
  }
  get snapToGrid() {
    return this._style.snapToGrid;
  }
  get spaceAbove() {
    return this._style.spaceAbove;
  }
  get spaceBelow() {
    return this._style.spaceBelow;
  }
  get borderBetween() {
    return this._style.borderBetween;
  }
  get borderTop() {
    return this._style.borderTop;
  }
  get borderBottom() {
    return this._style.borderBottom;
  }
  get borderLeft() {
    return this._style.borderLeft;
  }
  get borderRight() {
    return this._style.borderRight;
  }
  get keepLines() {
    return this._style.keepLines === z.TRUE;
  }
  get keepNext() {
    return this._style.keepNext === z.TRUE;
  }
  get wordWrap() {
    return this._style.wordWrap === z.TRUE;
  }
  get widowControl() {
    return this._style.widowControl === z.TRUE;
  }
  get shading() {
    return this._style.shading;
  }
  get suppressHyphenation() {
    return this._style.suppressHyphenation === z.TRUE;
  }
  copy() {
    return PE.create(j.deepClone(this._style));
  }
  getValue() {
    return this._style;
  }
}, PE = class ro extends Fd {
  static create(e = {}) {
    return new ro(e);
  }
  constructor(e = {}) {
    super(e);
  }
  setIndentFirstLine(e) {
    return this._style.indentFirstLine = e, this;
  }
  setHanging(e) {
    return this._style.hanging = e, this;
  }
  setIndentStart(e) {
    return this._style.indentStart = e, this;
  }
  setTabStops(e) {
    return this._style.tabStops = e, this;
  }
  setIndentEnd(e) {
    return this._style.indentEnd = e, this;
  }
  setTextStyle(e) {
    return this._style.textStyle = e, this;
  }
  setHeadingId(e) {
    return this._style.headingId = e, this;
  }
  setNamedStyleType(e) {
    return this._style.namedStyleType = e, this;
  }
  setHorizontalAlign(e) {
    return this._style.horizontalAlign = e, this;
  }
  setLineSpacing(e) {
    return this._style.lineSpacing = e, this;
  }
  setDirection(e) {
    return this._style.direction = e, this;
  }
  setSpacingRule(e) {
    return this._style.spacingRule = e, this;
  }
  setSnapToGrid(e) {
    return this._style.snapToGrid = e ? 1 : 0, this;
  }
  setSpaceAbove(e) {
    return this._style.spaceAbove = e, this;
  }
  setSpaceBelow(e) {
    return this._style.spaceBelow = e, this;
  }
  setBorderBetween(e) {
    return this._style.borderBetween = e, this;
  }
  setBorderTop(e) {
    return this._style.borderTop = e, this;
  }
  setBorderBottom(e) {
    return this._style.borderBottom = e, this;
  }
  setBorderLeft(e) {
    return this._style.borderLeft = e, this;
  }
  setBorderRight(e) {
    return this._style.borderRight = e, this;
  }
  setKeepLines(e) {
    return this._style.keepLines = e ? 1 : 0, this;
  }
  setKeepNext(e) {
    return this._style.keepNext = e ? 1 : 0, this;
  }
  setWordWrap(e) {
    return this._style.wordWrap = e ? 1 : 0, this;
  }
  setWidowControl(e) {
    return this._style.widowControl = e ? 1 : 0, this;
  }
  setShading(e) {
    return this._style.shading = e, this;
  }
  setSuppressHyphenation(e) {
    return this._style.suppressHyphenation = e ? 1 : 0, this;
  }
  copy() {
    return ro.create(j.deepClone(this._style));
  }
  build() {
    return this.getValue();
  }
}, hs = class so {
  static create(e) {
    return new so(e);
  }
  static createByBody(e) {
    return new so({ body: e, id: "d", documentStyle: {} });
  }
  constructor(e) {
    if (y(this, "_data", void 0), !e.body) throw Error("Invalid document data, body is required");
    this._data = Md(e);
  }
  copy() {
    return uu.create(j.deepClone(this._data));
  }
  slice(e, n) {
    let { body: r, ...s } = this._data;
    return uu.create({ ...j.deepClone(s), body: Xe(r, e, n) });
  }
  toPlainText() {
    var e, n;
    return oe.transform.getPlainText((e = (n = this._data.body) == null ? void 0 : n.dataStream) == null ? "" : e).replaceAll("\r", `
`);
  }
  getParagraphStyle() {
    var e;
    return Fd.create((e = this._data.body) == null || (e = e.paragraphs) == null ? void 0 : e[0].paragraphStyle);
  }
  getParagraphBullet() {
    var e;
    return (e = this._data.body) == null || (e = e.paragraphs) == null ? void 0 : e[0].bullet;
  }
  getParagraphs() {
    var e, n;
    let r = (e = (n = this._data.body) == null ? void 0 : n.paragraphs) == null ? [] : e, s = 0;
    return r.map((i) => {
      let o = this.slice(s, i.startIndex);
      return s = i.startIndex, o;
    });
  }
  getTextRuns() {
    var e, n;
    return ((e = (n = this._data.body) == null ? void 0 : n.textRuns) == null ? [] : e).map((r) => ({ ...r, ts: r.ts ? Ld.create(r.ts) : null }));
  }
  getLinks() {
    var e, n;
    return (e = (n = this._data.body) == null || (n = n.customRanges) == null ? void 0 : n.filter((r) => r.rangeType === qn.HYPERLINK)) == null ? [] : e;
  }
  getData() {
    return this._data;
  }
}, uu = class Is extends hs {
  static newEmptyData() {
    return Md({ id: "d", documentStyle: {}, drawings: {}, drawingsOrder: [], body: { dataStream: `\r
`, customBlocks: [], customRanges: [], paragraphs: [{ startIndex: 0 }], textRuns: [], tables: [], sectionBreaks: [] } });
  }
  static create(e) {
    return new Is(e ?? Is.newEmptyData());
  }
  constructor(e) {
    super(e), y(this, "_doc", void 0), this._doc = new xn(e);
  }
  insertText(e, n, r) {
    var s, i;
    let o = ((s = (i = this._data.body) == null ? void 0 : i.dataStream.length) == null ? 2 : s) - 2, a, l;
    if (typeof e == "string" ? a = e : (o = Math.min(e, o), a = n), l = typeof n == "object" ? n instanceof bs ? n.build() : n : r instanceof bs ? r.build() : r, !a) return this;
    let u = { dataStream: a, textRuns: l ? [{ ts: l, st: o, ed: o + a.length }] : [] }, c = oe.selection.replace({ doc: this._doc, selection: { startOffset: o, endOffset: o, collapsed: !0 }, body: u });
    if (!c) throw Error("Insert text failed, please check.");
    return Tt.apply(this._doc.getBody(), c.serialize()), this;
  }
  insertRichText(e, n) {
    var r, s;
    let i = ((r = (s = this._data.body) == null ? void 0 : s.dataStream.length) == null ? 2 : r) - 2, o;
    typeof e == "object" ? o = e instanceof hs ? e.getData() : e : (i = Math.min(e, i), o = n instanceof hs ? n.getData() : n);
    let a = oe.selection.replace({ doc: this._doc, selection: { startOffset: i, endOffset: i, collapsed: !0 }, body: o.body });
    if (!a) throw Error("Insert text failed, please check.");
    return Tt.apply(this._doc.getBody(), a.serialize()), this;
  }
  delete(e, n) {
    if (n !== void 0) {
      if (!n) return this;
      let r = oe.selection.delete([{ startOffset: e, endOffset: e + n, collapsed: !0 }], this._data.body);
      Tt.apply(this._doc.getBody(), r);
    }
    return this;
  }
  setStyle(e, n, r) {
    let s = { dataStream: "", textRuns: [{ ts: r instanceof bs ? r.build() : r, st: 0, ed: n - e }] }, i = oe.selection.retain([{ startOffset: e, endOffset: n, collapsed: !0 }], s);
    return Tt.apply(this._doc.getBody(), i), this;
  }
  setLink(e, n, r) {
    let s = oe.customRange.add({ rangeType: qn.HYPERLINK, rangeId: ce(), properties: { url: r }, ranges: [{ startOffset: e, endOffset: n, collapsed: !1 }], body: this._data.body });
    if (!s) throw Error("Insert text failed, please check.");
    return Tt.apply(this._doc.getBody(), s.serialize()), this;
  }
  cancelLink(e, n) {
    if (typeof e == "string") {
      let r = oe.customRange.delete({ rangeId: e, documentDataModel: this._doc });
      if (!r) throw Error("Insert text failed, please check.");
      Tt.apply(this._doc.getBody(), r.serialize());
    } else this.slice(e, n).getLinks().forEach((r) => {
      let s = oe.customRange.delete({ rangeId: r.rangeId, documentDataModel: this._doc });
      if (!s) throw Error("Insert text failed, please check.");
      Tt.apply(this._doc.getBody(), s.serialize());
    });
    return this;
  }
  updateLink(e, n) {
    var r;
    let s = (r = this._data.body) == null || (r = r.customRanges) == null ? void 0 : r.find((i) => i.rangeId === e);
    if (!s) throw Error("Link not found");
    return s.properties.url = n, this;
  }
  insertParagraph(e, n) {
    let r, s;
    if (typeof e == "object") {
      var i, o;
      r = { dataStream: "\r", paragraphs: [{ startIndex: 0, paragraphStyle: e.build() }] }, s = ((i = (o = this._data.body) == null ? void 0 : o.dataStream.length) == null ? 2 : i) - 2;
    } else s = e, r = { dataStream: "\r", paragraphs: [{ startIndex: 0, paragraphStyle: n == null ? void 0 : n.build() }] };
    return this.insertRichText(s, hs.create({ body: r, id: "d", documentStyle: {} })), this;
  }
  insertLink(e, n, r) {
    let s = "", i = "";
    typeof e == "string" ? (s = e, i = n) : (s = n, i = r);
    let o = Is.createByBody({ dataStream: s, customRanges: [{ rangeType: qn.HYPERLINK, rangeId: ce(), properties: { url: i }, startIndex: 0, endIndex: s.length - 1 }] });
    return typeof e == "number" ? this.insertRichText(e, o) : this.insertRichText(o);
  }
};
const L1 = "__default_document_sub_component_id20231101__";
var kE = class {
  constructor() {
    y(this, "skipNextObservers", !1), y(this, "lastReturnValue", void 0), y(this, "isStopPropagation", !1);
  }
  stopPropagation() {
    this.isStopPropagation = !0;
  }
}, x1 = class extends ae {
  constructor(...t) {
    super(...t), y(this, "_sortedObservers", []);
  }
  unsubscribe() {
    super.unsubscribe(), this._sortedObservers.length = 0;
  }
  complete() {
    super.complete(), this._sortedObservers.length = 0;
  }
  subscribeEvent(t) {
    let e;
    e = typeof t == "function" ? { next: ([r, s]) => t(r, s) } : t;
    let n = super.subscribe(e);
    return this._sortedObservers.push(e), this._sortedObservers.sort((r, s) => {
      var i, o;
      return ((i = r.priority) == null ? 0 : i) - ((o = s.priority) == null ? 0 : o);
    }), n.add(() => this._sortedObservers = this._sortedObservers.filter((r) => r !== e)), n;
  }
  clearObservers() {
    this._sortedObservers.forEach((t) => {
      var e;
      return (e = t.complete) == null ? void 0 : e.call(t);
    }), this._sortedObservers.length = 0;
  }
  emitEvent(t) {
    if (!this.closed) {
      let n = new kE();
      n.lastReturnValue = t;
      for (let r of this._sortedObservers) {
        var e;
        if (n.lastReturnValue = (e = r.next) == null ? void 0 : e.call(r, [t, n]), n.skipNextObservers) return { handled: !0, lastReturnValue: n.lastReturnValue, stopPropagation: n.isStopPropagation };
      }
      return { handled: this._sortedObservers.length > 0, lastReturnValue: n.lastReturnValue, stopPropagation: n.isStopPropagation };
    }
    throw Error("[EventSubject]: cannot emit event on a closed subject.");
  }
};
function F1(t) {
  return new ne((e) => {
    let n = t.subscribeEvent((r) => {
      e.next(r);
    });
    return () => n.unsubscribe();
  });
}
const La = me("core.resource-manager.service"), io = { [gt.Editor]: "Editor", [gt.Owner]: "Owner", [gt.Reader]: "Reader", [gt.UNRECOGNIZED]: "UNRECOGNIZED" }, oo = (t) => t ? { userID: `${io[t]}_${ce(8)}`, name: io[t], avatar: "" } : { userID: "", name: "", avatar: "", anonymous: !0, canBindAnonymous: !1 }, BE = (t, e) => t.startsWith(io[e]);
var xs = class extends Qt {
  constructor(...t) {
    super(...t), y(this, "_model", /* @__PURE__ */ new Map()), y(this, "_userChange$", new ae()), y(this, "userChange$", this._userChange$.asObservable()), y(this, "_currentUser$", new de(oo())), y(this, "currentUser$", this._currentUser$.asObservable());
  }
  dispose() {
    super.dispose(), this._model.clear(), this._userChange$.complete(), this._currentUser$.complete();
  }
  getCurrentUser() {
    return this._currentUser$.getValue();
  }
  setCurrentUser(t) {
    this.addUser(t), this._currentUser$.next(t);
  }
  addUser(t) {
    this._model.set(t.userID, t), this._userChange$.next({ type: "add", user: t });
  }
  getUser(t, e) {
    let n = this._model.get(t);
    if (n) return n;
    e && e();
  }
  delete(t) {
    let e = this.getUser(t);
    this._model.delete(t), e && this._userChange$.next({ type: "delete", user: e });
  }
  clear() {
    this._model.clear(), this._userChange$.next({ type: "clear" });
  }
  list() {
    return Array.from(this._model.values());
  }
};
let ao = class {
  constructor(t, e) {
    this._resourceManagerService = t, this._userManagerService = e, y(this, "_permissionMap", /* @__PURE__ */ new Map([])), y(this, "_permissionOverrides", /* @__PURE__ */ new Map()), this._initSnapshot(), this._initDefaultUser();
  }
  _initDefaultUser() {
    let t = this._userManagerService.getCurrentUser();
    t && t.userID || this._userManagerService.setCurrentUser(oo(gt.Owner));
  }
  _getRole(t) {
    let e = this._userManagerService.getCurrentUser();
    return e ? BE(e.userID, t) : !1;
  }
  _initSnapshot() {
    this._resourceManagerService.registerPluginResource({ toJson: (t) => {
      let e = [...this._permissionMap.keys()].reduce((n, r) => (n[r] = this._permissionMap.get(r), n), {});
      return JSON.stringify(e);
    }, parseJson: (t) => JSON.parse(t), pluginName: "SHEET_AuthzIoMockService_PLUGIN", businesses: [Et.UNIVER_SHEET, Et.UNIVER_DOC, Et.UNIVER_SLIDE], onLoad: (t, e) => {
      for (let n in e) this._permissionMap.set(n, e[n]);
    }, onUnLoad: () => {
      this._permissionMap.clear();
    } });
  }
  async create(t) {
    let e = ce(8), { objectType: n, selectRangeObject: r, worksheetObject: s } = t, i = r || s, o = { objectType: n, unitID: (i == null ? void 0 : i.unitID) || "", name: (i == null ? void 0 : i.name) || "", strategies: [{ action: 6, role: gt.Owner }, { action: 16, role: gt.Owner }, { action: 17, role: gt.Owner }, { action: 18, role: gt.Owner }, { action: 19, role: gt.Owner }, { action: 33, role: gt.Owner }, { action: 34, role: gt.Owner }, { action: 35, role: gt.Owner }, { action: 36, role: gt.Owner }, { action: 37, role: gt.Owner }, { action: 38, role: gt.Owner }, { action: 39, role: gt.Owner }, { action: 40, role: gt.Owner }], selectRangeObject: r };
    return this._permissionMap.set(e, o), e;
  }
  async allowed(t) {
    let { objectID: e, actions: n } = t, r = this._permissionMap.get(e);
    return r ? n.map((s) => {
      let i = `${e}:${s}`;
      if (this._permissionOverrides.has(i)) return { action: s, allowed: this._permissionOverrides.get(i) };
      let o = r.strategies.find((a) => a.action === s);
      return o ? { action: s, allowed: this._getRole(o.role) } : { action: s, allowed: this._getRole(gt.Owner) || this._getRole(gt.Editor) };
    }) : n.map((s) => ({ action: s, allowed: this._getRole(gt.Owner) || this._getRole(gt.Editor) }));
  }
  async batchAllowed(t) {
    let e = await Promise.all(t.map((n) => this.allowed(n)));
    return t.map((n, r) => ({ unitID: n.unitID, objectID: n.objectID, actions: e[r] }));
  }
  async list(t) {
    let e = [], n = [{ action: 6, role: gt.Owner }, { action: 16, role: gt.Owner }, { action: 17, role: gt.Owner }, { action: 18, role: gt.Owner }, { action: 19, role: gt.Owner }, { action: 33, role: gt.Owner }, { action: 34, role: gt.Owner }, { action: 35, role: gt.Owner }, { action: 36, role: gt.Owner }, { action: 37, role: gt.Owner }, { action: 38, role: gt.Owner }, { action: 39, role: gt.Owner }, { action: 40, role: gt.Owner }];
    return t.objectIDs.forEach((r) => {
      let s = this._permissionMap.get(r), i = (s == null ? void 0 : s.strategies) || n, o = { objectID: r, unitID: t.unitID, objectType: (s == null ? void 0 : s.objectType) || 3, name: (s == null ? void 0 : s.name) || "", shareOn: !1, shareRole: gt.Owner, shareScope: -1, scope: { read: Di.AllCollaborator, edit: Di.AllCollaborator }, creator: oo(gt.Owner), strategies: i.map((a) => ({ action: a.action, role: a.role })), actions: t.actions.map((a) => {
        let l = `${r}:${a}`;
        if (this._permissionOverrides.has(l)) return { action: a, allowed: this._permissionOverrides.get(l) };
        let u = i.find((c) => c.action === a);
        return u ? { action: a, allowed: this._getRole(u.role) } : { action: a, allowed: this._getRole(gt.Owner) || this._getRole(gt.Editor) };
      }) };
      e.push(o);
    }), e;
  }
  async listCollaborators() {
    return [];
  }
  async listRoles() {
    return { roles: [], actions: [] };
  }
  async deleteCollaborator() {
  }
  async update(t) {
    let { objectID: e, strategies: n } = t, r = this._permissionMap.get(e);
    r && n && (r.strategies = n.map((s) => ({ action: s.action, role: s.role })), this._permissionMap.set(e, r), n.forEach((s) => {
      s.role === gt.Reader ? this.setPermissionOverride(e, s.action, !1) : (s.role === gt.Owner || s.role === gt.Editor) && this.clearPermissionOverride(e, s.action);
    }));
  }
  setPermissionOverride(t, e, n) {
    let r = `${t}:${e}`;
    this._permissionOverrides.set(r, n);
  }
  clearPermissionOverride(t, e) {
    let n = `${t}:${e}`;
    this._permissionOverrides.delete(n);
  }
  clearAllOverrides(t) {
    let e = [];
    this._permissionOverrides.forEach((n, r) => {
      r.startsWith(`${t}:`) && e.push(r);
    }), e.forEach((n) => this._permissionOverrides.delete(n));
  }
  async updateCollaborator() {
  }
  async createCollaborator() {
  }
  async putCollaborators(t) {
  }
};
ao = Ue([Ut(0, La), Ut(1, Le(xs))], ao);
const HE = me("IAuthzIoIoService"), U1 = me("univer.confirm-service");
var P1 = class {
  constructor() {
    y(this, "confirmOptions$", new ae());
  }
  dispose() {
    this.confirmOptions$.complete();
  }
  open(t) {
    throw Error("This is not implemented in the test service!");
  }
  confirm(t) {
    return Promise.resolve(!0);
  }
  close(t) {
    throw Error("This is not implemented in the test service!");
  }
};
const fs = "FOCUSING_UNIT", Sr = "FOCUSING_SHEET", ps = "FOCUSING_DOC", gs = "FOCUSING_SLIDE", k1 = "FOCUSING_EDITOR_BUT_HIDDEN", jE = "EDITOR_ACTIVATED", B1 = "FOCUSING_EDITOR_INPUT_FORMULA", $E = "FOCUSING_FX_BAR_EDITOR", H1 = "FOCUSING_UNIVER_EDITOR", j1 = "FOCUSING_EDITOR_INPUT_FORMULA", $1 = "FOCUSING_COMMENT_EDITOR", W1 = "FOCUSING_PANEL_EDITOR", V1 = "FOCUSING_UNIVER_EDITOR_STANDALONE_SINGLE_MODE", G1 = "FOCUSING_COMMON_DRAWINGS", Y1 = "FOCUSING_SHAPE_TEXT_EDITOR", z1 = "FORMULA_EDITOR_ACTIVATED";
var WE = class extends Qt {
  constructor(...t) {
    super(...t), y(this, "_error$", new ae()), y(this, "error$", this._error$.asObservable());
  }
  dispose() {
    this._error$.complete();
  }
  emit(t) {
    this._error$.next({ errorKey: t });
  }
};
let cu = function(t) {
  return t.URL = "URL", t.UUID = "UUID", t.BASE64 = "BASE64", t;
}({}), K1 = function(t) {
  return t.SUCCUSS = "0", t.ERROR_EXCEED_SIZE = "1", t.ERROR_IMAGE_TYPE = "2", t.ERROR_UPLOAD_COUNT_LIMIT = "3", t.ERROR_IMAGE = "4", t;
}({});
const du = me("core.image-io.service"), hu = me("core.url-image.service");
var VE = "@univerjs/core", Pd = "0.19.0";
function GE(t = "", e = Ta.ZH_CN, n = "") {
  return { id: t, sheetOrder: [], name: n, appVersion: Pd, locale: e, styles: {}, sheets: {}, resources: [] };
}
var YE = class {
  constructor(t = {}) {
    y(this, "_styles", void 0), y(this, "_cacheMap", new Aa(1e5)), this._styles = t, this._generateCacheMap();
  }
  each(t) {
    return Object.entries(this._styles).forEach(t), this;
  }
  search(t, e) {
    return this._cacheMap.has(e) ? this._cacheMap.get(e) : this._getExistingStyleId(t) || "-1";
  }
  get(t) {
    return typeof t == "string" ? (t = String(t), this._styles[t]) : t;
  }
  add(t, e) {
    let n = ce(6);
    return this._styles[n] = t, this._cacheMap.set(e, n), n;
  }
  setValue(t) {
    if (t == null) return;
    let e = JSON.stringify(t), n = this.search(t, e);
    return n === "-1" ? this.add(t, e) : n;
  }
  addCustomStyle(t, e) {
    e != null && (this._styles[t] = e, this._cacheMap.set(JSON.stringify(e), t));
  }
  remove(t) {
    let e = this._styles[t];
    e && (delete this._styles[t], this._cacheMap.delete(JSON.stringify(e)));
  }
  toJSON() {
    return this._styles;
  }
  getStyleByCell(t) {
    let e;
    e = t && j.isObject(t.s) ? t.s : (t == null ? void 0 : t.s) && this.get(t.s);
    let n = t == null ? void 0 : t.interceptorStyle;
    return n ? { ...e, ...n } : e;
  }
  _generateCacheMap() {
    let { _styles: t, _cacheMap: e } = this;
    for (let n in t) {
      let r = JSON.stringify(t[n]);
      e.set(r, n);
    }
  }
  _getExistingStyleId(t) {
    let { _styles: e } = this;
    for (let n in e) if (j.diffValue(e[n], t)) return n;
    return null;
  }
};
const X1 = (t, e) => e.length === t.length && !t.some((n) => e.some((r) => !je.equals(r, n))), Q1 = (t, e) => e.length === t.length && t.every((n, r) => {
  let s = e[r];
  return s.unitId === n.unitId && s.sheetId === n.sheetId && je.equals(n.range, s.range);
}), lo = { t: 0, b: 2, l: 2, r: 2 }, zE = (t) => ({ sbr: 0.6, sbo: t, spr: 0.6, spo: t });
function ms(t, e, n = {}) {
  let r = t.length, { textRotation: s, paddingData: i, horizontalAlign: o = sn.UNSPECIFIED, verticalAlign: a = Nr.UNSPECIFIED, wrapStrategy: l = Hr.UNSPECIFIED, cellValueType: u } = n, { t: c, r: d, b: h, l: f } = i || lo, { vertexAngle: p, centerAngle: g } = kd(s);
  return new xn({ id: "d", body: { dataStream: `${t}\r
`, textRuns: [{ ts: e, st: 0, ed: r }], paragraphs: [{ startIndex: r, paragraphStyle: { horizontalAlign: o } }], sectionBreaks: [{ startIndex: r + 1 }] }, documentStyle: { pageSize: { width: 1 / 0, height: 1 / 0 }, marginTop: c, marginBottom: h, marginRight: d, marginLeft: f, renderConfig: { horizontalAlign: o, verticalAlign: a, centerAngle: g, vertexAngle: p, wrapStrategy: l, cellValueType: u } }, drawings: {}, drawingsOrder: [] });
}
function KE(t) {
  if (!t) return {};
  let { tr: e, td: n, ht: r, vt: s, tb: i, pd: o } = t;
  return { textRotation: e, textDirection: n, horizontalAlign: r, verticalAlign: s, wrapStrategy: i, paddingData: o };
}
function fu(t) {
  if (!t) return {};
  let { ff: e, fs: n, it: r, bl: s, ul: i, st: o, ol: a, cl: l } = t, u = {};
  return e && (u.ff = e), n && (u.fs = n), r && (u.it = r), s && (u.bl = s), i && (u.ul = i), o && (u.st = o), a && (u.ol = a), l && (u.cl = l), u;
}
function XE(t, e, n) {
  var r;
  let s = t.getBody();
  if ((r = s.customRanges) != null && r.some((o) => o.rangeType === qn.HYPERLINK)) return;
  let i = oe.customRange.add({ ranges: [{ startOffset: 0, endOffset: s.dataStream.length - 1, collapsed: !1 }], rangeId: n, rangeType: qn.HYPERLINK, body: s, properties: { url: e, refId: n } });
  i && Tt.apply(s, i.serialize());
}
function QE(t) {
  return t != null;
}
function J1() {
  return { p: null, s: null, v: null, t: null, f: null, si: null, ref: null, xf: null };
}
function pu(t) {
  let e = pe.ff, n = pe.fs;
  if (!t) {
    let c = `${n}pt  ${e}`;
    return { fontCache: c, fontString: c, fontSize: n, originFontSize: n, fontFamily: e };
  }
  let r = ns.ITALIC;
  (t.it === 0 || t.it === void 0) && (r = ns.NORMAL);
  let s = ns.BOLD;
  (t.bl === 0 || t.bl === void 0) && (s = ns.NORMAL);
  let i = n;
  t.fs && (i = Math.ceil(t.fs));
  let o = e;
  if (t.ff) {
    let c = t.ff;
    c = c.replace(/"/g, "").replace(/'/g, ""), c.indexOf(" ") > -1 && (c = `"${c}"`), c == null && (c = e), o = c;
  }
  let { va: a } = t, l = i;
  if (a === Dr.SUBSCRIPT || a === Dr.SUPERSCRIPT) {
    let { sbr: c, spr: d } = JE(o, l);
    l *= a === Dr.SUBSCRIPT ? c : d;
  }
  let u = `${r} ${s} ${l}pt ${o}`;
  return { fontCache: u, fontString: `${u}, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif `, fontSize: l, originFontSize: i, fontFamily: o };
}
function JE(t, e) {
  return zE(e);
}
function kd(t) {
  let { a: e = 0, v: n = z.FALSE } = t || { a: 0, v: z.FALSE }, r = 0, s = e;
  return n === z.TRUE && (r = 90, s = 90), { centerAngle: r, vertexAngle: s };
}
function Me(t) {
  if (typeof t != "object" || !t) return t;
  if (Array.isArray(t)) {
    let r = t.length, s = Array(r);
    for (let i = 0; i < r; i++) s[i] = Me(t[i]);
    return s;
  }
  let e = {}, n = Object.keys(t);
  for (let r = 0, s = n.length; r < s; r++) {
    let i = n[r];
    e[i] = Me(t[i]);
  }
  return e;
}
function ZE(t) {
  if (t == null) return t;
  let e = {};
  return t.p !== void 0 && (e.p = t.p === null ? null : Me(t.p)), t.s !== void 0 && (t.s === null || typeof t.s == "string" ? e.s = t.s : e.s = Me(t.s)), t.v !== void 0 && (e.v = t.v), t.t !== void 0 && (e.t = t.t), t.f !== void 0 && (e.f = t.f), t.ref !== void 0 && (e.ref = t.ref), t.xf !== void 0 && (e.xf = t.xf), t.si !== void 0 && (e.si = t.si), t.custom !== void 0 && (e.custom = t.custom === null ? null : Me(t.custom)), e;
}
function Z1(t) {
  if (t == null) return t;
  let e = {};
  return t.p !== void 0 && (e.p = t.p === null ? null : Me(t.p)), t.s !== void 0 && (t.s === null || typeof t.s == "string" ? e.s = t.s : e.s = Me(t.s)), t.v !== void 0 && (e.v = t.v), t.t !== void 0 && (e.t = t.t), t.f !== void 0 && (e.f = t.f), t.ref !== void 0 && (e.ref = t.ref), t.xf !== void 0 && (e.xf = t.xf), t.si !== void 0 && (e.si = t.si), t.custom !== void 0 && (e.custom = t.custom === null ? null : Me(t.custom)), t.rowSpan !== void 0 && (e.rowSpan = t.rowSpan), t.colSpan !== void 0 && (e.colSpan = t.colSpan), t.displayV !== void 0 && (e.displayV = t.displayV), e;
}
function qE(t) {
  let e = {}, n = Object.keys(t);
  for (let r = 0, s = n.length; r < s; r++) {
    let i = n[r], o = Number(i), a = t[o];
    if (a === void 0) continue;
    let l = {}, u = Object.keys(a);
    for (let c = 0, d = u.length; c < d; c++) {
      let h = u[c], f = Number(h), p = a[f];
      p != null && (l[f] = ZE(p));
    }
    e[o] = l;
  }
  return e;
}
function gu(t) {
  let e = {}, n = Object.keys(t);
  for (let r = 0, s = n.length; r < s; r++) {
    let i = n[r], o = Number(i), a = t[o];
    if (a === void 0) continue;
    let l = {};
    "h" in a && a.h !== void 0 && (l.h = a.h), "ia" in a && a.ia !== void 0 && (l.ia = a.ia), "ah" in a && a.ah !== void 0 && (l.ah = a.ah), "hd" in a && a.hd !== void 0 && (l.hd = a.hd), "w" in a && a.w !== void 0 && (l.w = a.w), "s" in a && a.s !== void 0 && (a.s === null || typeof a.s == "string" ? l.s = a.s : l.s = Me(a.s)), "custom" in a && a.custom !== void 0 && (l.custom = a.custom === null ? null : Me(a.custom)), e[o] = l;
  }
  return e;
}
function tv(t) {
  let e = t.length, n = Array(e);
  for (let r = 0; r < e; r++) {
    let s = t[r];
    n[r] = { startRow: s.startRow, startColumn: s.startColumn, endRow: s.endRow, endColumn: s.endColumn, rangeType: s.rangeType, startAbsoluteRefType: s.startAbsoluteRefType, endAbsoluteRefType: s.endAbsoluteRefType };
  }
  return n;
}
function ev(t) {
  let e = { id: t.id, name: t.name, tabColor: t.tabColor, hidden: t.hidden, rowCount: t.rowCount, columnCount: t.columnCount, zoomRatio: t.zoomRatio, scrollTop: t.scrollTop, scrollLeft: t.scrollLeft, defaultColumnWidth: t.defaultColumnWidth, defaultRowHeight: t.defaultRowHeight, showGridlines: t.showGridlines, rightToLeft: t.rightToLeft, freeze: { xSplit: t.freeze.xSplit, ySplit: t.freeze.ySplit, startRow: t.freeze.startRow, startColumn: t.freeze.startColumn }, rowHeader: { width: t.rowHeader.width, hidden: t.rowHeader.hidden }, columnHeader: { height: t.columnHeader.height, hidden: t.columnHeader.hidden }, mergeData: tv(t.mergeData), cellData: qE(t.cellData), rowData: gu(t.rowData), columnData: gu(t.columnData) };
  return t.gridlinesColor !== void 0 && (e.gridlinesColor = t.gridlinesColor), t.defaultStyle !== void 0 && (t.defaultStyle === null || typeof t.defaultStyle == "string" ? e.defaultStyle = t.defaultStyle : e.defaultStyle = Me(t.defaultStyle)), t.custom !== void 0 && (e.custom = t.custom === null ? null : Me(t.custom)), e;
}
var nv = class {
  constructor(t, e) {
    this._config = t, y(this, "_columnData", {}), this._columnData = e;
  }
  getColumnData() {
    return this._columnData;
  }
  getColVisible(t) {
    let { _columnData: e } = this, n = e[t];
    return n ? n.hd !== z.TRUE : !0;
  }
  getColumnStyle(t) {
    var e;
    return (e = this._columnData[t]) == null ? void 0 : e.s;
  }
  setColumnStyle(t, e) {
    let n = this.getColumnOrCreate(t);
    n.s = e;
  }
  getHiddenCols(t = 0, e = this.getSize() - 1) {
    let n = [], r = !1, s = -1;
    for (let i = t; i <= e; i++) {
      let o = this.getColVisible(i);
      r && o ? (r = !1, n.push({ rangeType: at.COLUMN, startColumn: s, endColumn: i - 1, startRow: 0, endRow: 0 })) : !r && !o && (r = !0, s = i);
    }
    return r && n.push({ startRow: 0, endRow: 0, startColumn: s, endColumn: e, rangeType: at.COLUMN }), n;
  }
  getVisibleCols(t = 0, e = this.getSize() - 1) {
    let n = [], r = !1, s = -1;
    for (let i = t; i <= e; i++) {
      let o = this.getColVisible(i);
      r && !o ? (r = !1, n.push({ rangeType: at.COLUMN, startColumn: s, endColumn: i - 1, startRow: 0, endRow: 0 })) : !r && o && (r = !0, s = i);
    }
    return r && n.push({ startRow: 0, endRow: 0, startColumn: s, endColumn: e, rangeType: at.COLUMN }), n;
  }
  getColumnDatas(t, e) {
    let n = {}, r = 0;
    for (let s = t; s < t + e; s++) {
      let i = this.getColumn(s);
      n[r] = i ?? { w: this._config.defaultColumnWidth, hd: z.FALSE }, r++;
    }
    return n;
  }
  getSize() {
    return wn(this._columnData);
  }
  getColumnWidth(t) {
    var e, n;
    return (e = (n = this._columnData[t]) == null ? void 0 : n.w) == null ? this._config.defaultColumnWidth : e;
  }
  setColumnWidth(t, e) {
    let n = this._columnData[t];
    e === this._config.defaultColumnWidth ? n && (delete n.w, Object.keys(n).length === 0 && delete this._columnData[t]) : this._columnData[t] = n ? { ...n, w: e } : { w: e };
  }
  getColumn(t) {
    return this._columnData[t];
  }
  insertColumnsWithData(t, e, n) {
    let r = e - t + 1, s = Object.keys(this._columnData);
    for (let i = s.length - 1; i >= 0; i--) {
      let o = Number(s[i]);
      o >= t && (this._columnData[o + r] = this._columnData[o], delete this._columnData[o]);
    }
    for (let i = t; i <= e; i++) {
      let o = n == null ? void 0 : n[i - t];
      o != null && Object.keys(o).length > 0 && (this._columnData[i] = { ...o });
    }
  }
  removeColumn(t) {
    delete this._columnData[t];
  }
  getColumnOrCreate(t) {
    let { _columnData: e } = this, n = e[t];
    if (n) return n;
    let r = {};
    return this._columnData[t] = r, r;
  }
  setCustomMetadata(t, e) {
    let n = this.getColumn(t);
    n && (n.custom = e);
  }
  getCustomMetadata(t) {
    var e;
    return (e = this.getColumn(t)) == null ? void 0 : e.custom;
  }
}, rv = class {
  constructor(t, e, n) {
    this._config = t, this._viewModel = e, y(this, "_rowData", void 0), this._rowData = n;
  }
  getRowData() {
    return this._rowData;
  }
  getRowStyle(t) {
    var e;
    return (e = this._rowData[t]) == null ? void 0 : e.s;
  }
  setRowStyle(t, e) {
    let n = this.getRowOrCreate(t);
    n.s = e;
  }
  getRowDatas(t, e) {
    let n = {}, r = 0;
    for (let s = t; s < t + e; s++) {
      let i = this.getRow(s);
      n[r] = i ?? { h: this._config.defaultRowHeight, hd: z.FALSE }, r++;
    }
    return n;
  }
  getRowHeight(t, e = 1) {
    let { _rowData: n } = this, r = this._config, s = 0;
    for (let i = 0; i < e; i++) {
      let { ia: o, ah: a, h: l = r.defaultRowHeight } = n[i + t] || { hd: z.FALSE, h: r.defaultRowHeight };
      s += (o == null || o === z.TRUE) && typeof a == "number" ? a : l;
    }
    return s;
  }
  setRowHeight(t, e) {
    let n = this._rowData[t];
    if (e === this._config.defaultRowHeight) n && (delete n.h, Object.keys(n).length === 0 && delete this._rowData[t]);
    else {
      let r = Math.min(e, 2e3);
      this._rowData[t] = n ? { ...n, h: r } : { h: r };
    }
  }
  getRow(t) {
    return this._rowData[t];
  }
  insertRowsWithData(t, e, n) {
    let r = e - t + 1, s = Object.keys(this._rowData);
    for (let i = s.length - 1; i >= 0; i--) {
      let o = Number(s[i]);
      o >= t && (this._rowData[o + r] = this._rowData[o], delete this._rowData[o]);
    }
    for (let i = t; i <= e; i++) {
      let o = n == null ? void 0 : n[i - t];
      o != null && Object.keys(o).length > 0 && (this._rowData[i] = { ...o });
    }
  }
  removeRow(t) {
    delete this._rowData[t];
  }
  getRowOrCreate(t) {
    let { _rowData: e } = this, n = e[t];
    if (n) return n;
    let r = {};
    return e[t] = r, r;
  }
  getHiddenRows(t = 0, e = this.getSize() - 1) {
    let n = [], r = !1, s = -1;
    for (let i = t; i <= e; i++) {
      let o = this.getRowRawVisible(i);
      r && o ? (r = !1, n.push({ startRow: s, endRow: i - 1, startColumn: 0, endColumn: 0, rangeType: at.ROW })) : !r && !o && (r = !0, s = i);
    }
    return r && n.push({ startRow: s, endRow: e, startColumn: 0, endColumn: 0, rangeType: at.ROW }), n;
  }
  getVisibleRows(t = 0, e = this.getSize() - 1) {
    let n = [], r = !1, s = -1;
    for (let i = t; i <= e; i++) {
      let o = this.getRowRawVisible(i);
      r && !o ? (r = !1, n.push({ startRow: s, endRow: i - 1, startColumn: 0, endColumn: 0, rangeType: at.ROW })) : !r && o && (r = !0, s = i);
    }
    return r && n.push({ startRow: s, endRow: e, startColumn: 0, endColumn: 0, rangeType: at.ROW }), n;
  }
  getRowRawVisible(t) {
    let e = this.getRow(t);
    return e ? e.hd !== z.TRUE : !0;
  }
  getSize() {
    return wn(this._rowData);
  }
  setCustomMetadata(t, e) {
    let n = this.getRow(t);
    n && (n.custom = e);
  }
  getCustomMetadata(t) {
    var e;
    return (e = this.getRow(t)) == null ? void 0 : e.custom;
  }
};
const q1 = "DEFAULT_WORKSHEET_ROW_COUNT", sv = 1e3, tb = "DEFAULT_WORKSHEET_COLUMN_COUNT", eb = 20, nb = "DEFAULT_WORKSHEET_ROW_HEIGHT", rb = 24, sb = "DEFAULT_WORKSHEET_COLUMN_WIDTH", ib = 88, ob = "DEFAULT_WORKSHEET_ROW_TITLE_WIDTH", ab = 46, lb = "DEFAULT_WORKSHEET_COLUMN_TITLE_HEIGHT", ub = 20;
function iv(t) {
  let e = { name: "Sheet1", id: "sheet-01", tabColor: "", hidden: z.FALSE, rowCount: sv, columnCount: 20, zoomRatio: 1, freeze: { xSplit: 0, ySplit: 0, startRow: -1, startColumn: -1 }, scrollTop: 0, scrollLeft: 0, defaultColumnWidth: 88, defaultRowHeight: 24, mergeData: [], cellData: {}, rowData: {}, columnData: {}, showGridlines: z.TRUE, rowHeader: { width: 46, hidden: z.FALSE }, columnHeader: { height: 20, hidden: z.FALSE }, rightToLeft: z.FALSE };
  return Object.keys(e).forEach((n) => {
    let r = n;
    t[r] === void 0 && (t[r] = e[r]);
  }), t;
}
var ov = class extends Qt {
  constructor(t) {
    super(), y(this, "_cellCache", /* @__PURE__ */ new Map()), y(this, "_rowCache", /* @__PURE__ */ new Map()), y(this, "_columnCache", /* @__PURE__ */ new Map()), y(this, "_hasRow", !1), y(this, "_hasColumn", !1), y(this, "_hasAll", !1), y(this, "_allIndex", -1), y(this, "_mergeData", void 0), y(this, "_rangeMap", new Aa(5e4)), this._init(t.concat());
  }
  _init(t) {
    this._mergeData = t, this._createCache(t);
  }
  _clearCache() {
    this._cellCache.clear(), this._rowCache.clear(), this._columnCache.clear(), this._hasAll = !1, this._allIndex = -1, this._rangeMap.clear(), this._hasColumn = !1, this._hasRow = !1;
  }
  _createCache(t) {
    let e = 0;
    for (let n of t) {
      let { rangeType: r } = n;
      r === at.ROW ? this._createRowCache(n, e) : r === at.COLUMN ? this._createColumnCache(n, e) : r === at.ALL ? this._createCellAllCache(e) : this._createCellCache(n, e), e++;
    }
  }
  rebuild(t) {
    this._clearCache(), this._init(t.concat());
  }
  _createRowCache(t, e) {
    let { startRow: n, endRow: r } = t;
    for (let s = n; s <= r; s++) this._rowCache.set(s, e), this._hasRow = !0;
  }
  _createColumnCache(t, e) {
    let { startColumn: n, endColumn: r } = t;
    for (let s = n; s <= r; s++) this._columnCache.set(s, e), this._hasColumn = !0;
  }
  _createCellAllCache(t) {
    this._hasAll = !0, this._allIndex = t;
  }
  _createCellCache(t, e) {
    for (let n = t.startRow; n <= t.endRow; n++) {
      let r = this._cellCache.get(n);
      r == null && (r = /* @__PURE__ */ new Map(), this._cellCache.set(n, r));
      for (let s = t.startColumn; s <= t.endColumn; s++) r.set(s, e);
    }
  }
  add(t) {
    this._mergeData.push(t), this._clearCache(), this._createCache(this._mergeData);
  }
  remove(t, e) {
    let n = this._getMergeDataIndex(t, e);
    n !== -1 && (this._mergeData.splice(n, 1), this._clearCache(), this._createCache(this._mergeData));
  }
  getMergedCell(t, e) {
    let n = this._getMergeDataIndex(t, e);
    return n === -1 ? null : this._mergeData[n];
  }
  getMergeDataIndex(t, e) {
    return this._getMergeDataIndex(t, e);
  }
  isRowContainsMergedCell(t) {
    return this._hasAll || !j.isEmptyObject(this._columnCache) ? !0 : this._mergeData.some((e) => e.startRow <= t && t <= e.endRow);
  }
  isColumnContainsMergedCell(t) {
    return this._hasAll || !j.isEmptyObject(this._rowCache) ? !0 : this._mergeData.some((e) => e.startColumn <= t && t <= e.endColumn);
  }
  getMergedCellRange(t, e, n, r) {
    let s = [], i = `${t}-${e}-${n}-${r}`;
    if (this._rangeMap.has(i)) return this._getRangeFromCache(i);
    let o = 0, a = [];
    for (let l of this._mergeData || []) je.intersects(l, { startRow: t, endRow: n, startColumn: e, endColumn: r }) && (s.push({ ...l }), a.push(o)), o++;
    return this._rangeMap.set(i, a), s;
  }
  _getRangeFromCache(t) {
    let e = this._rangeMap.get(t) || [], n = [];
    for (let r of e) n.push({ ...this._mergeData[r] });
    return n;
  }
  _getMergeDataIndex(t, e) {
    var n;
    if (this._hasAll) return this._allIndex;
    if (this._hasRow) {
      let s = this._rowCache.get(t);
      if (s !== void 0) return s;
    }
    if (this._hasColumn) {
      let s = this._columnCache.get(e);
      if (s !== void 0) return s;
    }
    let r = (n = this._cellCache.get(t)) == null ? void 0 : n.get(e);
    return r === void 0 ? -1 : r;
  }
  getMergeDataSnapshot() {
    return this._mergeData;
  }
  dispose() {
    this._clearCache(), this._mergeData = [];
  }
}, av = class extends Qt {
  constructor(t) {
    super(), this.getRawCell = t, y(this, "_cellContentInterceptor", null), y(this, "_rowFilteredInterceptor", null);
  }
  dispose() {
    super.dispose(), this._cellContentInterceptor = null, this._rowFilteredInterceptor = null;
  }
  getCell(t, e, n, r) {
    return this._cellContentInterceptor ? this._cellContentInterceptor.getCell(t, e, ts.Value | ts.Style, n, r) : this.getRawCell(t, e);
  }
  getCellValueOnly(t, e) {
    return this._cellContentInterceptor ? this._cellContentInterceptor.getCell(t, e, ts.Value) : this.getRawCell(t, e);
  }
  getCellStyleOnly(t, e) {
    return this._cellContentInterceptor ? this._cellContentInterceptor.getCell(t, e, ts.Style) : this.getRawCell(t, e);
  }
  getRowFiltered(t) {
    var e, n;
    return (e = (n = this._rowFilteredInterceptor) == null ? void 0 : n.getRowFiltered(t)) == null ? !1 : e;
  }
  registerCellContentInterceptor(t) {
    if (this._cellContentInterceptor) throw Error("[SheetViewModel]: Interceptor already registered.");
    return this._cellContentInterceptor = t, Gt(() => this._cellContentInterceptor = null);
  }
  registerRowFilteredInterceptor(t) {
    if (this._rowFilteredInterceptor) throw Error("[SheetViewModel]: Interceptor already registered.");
    return this._rowFilteredInterceptor = t, Gt(() => this._rowFilteredInterceptor = null);
  }
};
const mu = { isDeepClone: !1, displayRawFormula: !1, ignoreTextRotation: !1 };
var _u = class Bd {
  constructor(e, n, r) {
    var s;
    this.unitId = e, this._styles = r, y(this, "_sheetId", void 0), y(this, "_snapshot", void 0), y(this, "_cellData", void 0), y(this, "_rowManager", void 0), y(this, "_columnManager", void 0), y(this, "_viewModel", void 0), y(this, "_spanModel", void 0), y(this, "_isRowStylePrecedeColumnStyle", !0), y(this, "_getCellHeight", void 0), this._snapshot = iv(n);
    let { columnData: i, rowData: o, cellData: a } = this._snapshot;
    this._sheetId = (s = this._snapshot.id) == null ? ce(6) : s, this._cellData = new An(a), this._viewModel = new av((l, u) => this.getCellRaw(l, u)), this._rowManager = new rv(this._snapshot, this._viewModel, o), this._columnManager = new nv(this._snapshot, i), this._spanModel = new ov(this._snapshot.mergeData);
  }
  __interceptViewModel(e) {
    e(this._viewModel);
  }
  __registerGetCellHeight(e) {
    return this._getCellHeight = e, Gt(() => {
      this._getCellHeight = null;
    });
  }
  getSnapshot() {
    return this._snapshot;
  }
  getCellHeight(e, n) {
    return this._getCellHeight ? this._getCellHeight(e, n) : this._snapshot.defaultRowHeight;
  }
  setMergeData(e) {
    this._snapshot.mergeData = e, this.getSpanModel().rebuild(e);
  }
  getSpanModel() {
    return this._spanModel;
  }
  setIsRowStylePrecedeColumnStyle(e) {
    this._isRowStylePrecedeColumnStyle = e;
  }
  getStyleDataByHash(e) {
    return { ...this._styles.get(e) };
  }
  setStyleData(e) {
    return this._styles.setValue(e);
  }
  getColumnStyle(e, n = !1) {
    return n ? this._columnManager.getColumnStyle(e) : this._styles.get(this._columnManager.getColumnStyle(e));
  }
  setColumnStyle(e, n) {
    this._columnManager.setColumnStyle(e, n);
  }
  getRowStyle(e, n = !1) {
    return n ? this._rowManager.getRowStyle(e) : this._styles.get(this._rowManager.getRowStyle(e));
  }
  setRowStyle(e, n) {
    this._rowManager.setRowStyle(e, n);
  }
  getDefaultCellStyle() {
    return this._snapshot.defaultStyle;
  }
  getDefaultCellStyleInternal() {
    let e = this._snapshot.defaultStyle;
    return this._styles.get(e);
  }
  setDefaultCellStyle(e) {
    this._snapshot.defaultStyle = e;
  }
  getCellStyle(e, n) {
    let r = this.getCell(e, n);
    if (r) {
      let s = r.s;
      return typeof s == "string" ? this._styles.get(s) : s;
    }
    return null;
  }
  getComposedCellStyle(e, n, r) {
    let s = this.getDefaultCellStyleInternal(), i = this.getRowStyle(e), o = this.getColumnStyle(n), a = this.getCell(e, n), l = this._styles.getStyleByCell(a);
    return r ?? this._isRowStylePrecedeColumnStyle ? es(s, o, i, a == null ? void 0 : a.themeStyle, l) : es(s, i, o, a == null ? void 0 : a.themeStyle, l);
  }
  getComposedCellStyleByCellData(e, n, r, s) {
    let i = this.getDefaultCellStyleInternal(), o = this.getRowStyle(e), a = this.getColumnStyle(n), l = this._styles.getStyleByCell(r);
    return s ?? this._isRowStylePrecedeColumnStyle ? es(i, a, o, r == null ? void 0 : r.themeStyle, l) : es(i, o, a, r == null ? void 0 : r.themeStyle, l);
  }
  getComposedCellStyleWithoutSelf(e, n, r, s) {
    let i = r === void 0 ? this.getComposedCellStyle(e, n, s) : this.getComposedCellStyleByCellData(e, n, r, s), o = this.getCellRaw(e, n);
    if (!o || !o.s) return i;
    let a = typeof o.s == "string" ? this._styles.get(o.s) : o.s;
    if (!a) return i;
    for (let l in a) l in i && delete i[l];
    return i;
  }
  getCellMatrix() {
    return this._cellData;
  }
  getCellMatrixPrintRange() {
    let e = this.getCellMatrix(), n = this.getMergeData(), r = -1, s = -1, i = -1, o = -1, a = !1, l = !1;
    return e.forEach((u, c) => {
      Object.keys(c).forEach((d) => {
        let h = +d, f = e.getValue(u, h), p = f != null && f.s ? this._styles.get(f.s) : null, g = (p == null ? void 0 : p.bd) && (p.bd.b || p.bd.l || p.bd.r || p.bd.t || p.bd.bc_tr || p.bd.bl_tr || p.bd.ml_tr || p.bd.tl_bc || p.bd.tl_br || p.bd.tl_mr);
        (f && (f.v !== null && f.v !== void 0 && f.v !== "" || f.p) || p != null && p.bg || g) && (a ? r = Math.min(r, u) : (r = u, a = !0), s = Math.max(s, u), l ? i = Math.min(i, h) : (l = !0, i = h), o = Math.max(o, h));
      });
    }), n.forEach((u) => {
      a ? r = Math.min(r, u.startRow) : (r = u.startRow, a = !0), s = Math.max(s, u.endRow), l ? i = Math.min(i, u.startColumn) : (i = u.startColumn, a = !0), o = Math.max(o, u.endColumn);
    }), !a || !l ? null : { startColumn: i, startRow: r, endColumn: o, endRow: s };
  }
  getRowManager() {
    return this._rowManager;
  }
  getUnitId() {
    return this.unitId;
  }
  getSheetId() {
    return this._sheetId;
  }
  getColumnManager() {
    return this._columnManager;
  }
  getName() {
    return this._snapshot.name;
  }
  clone() {
    let { _snapshot: e } = this, n = ev(e);
    return new Bd(this.unitId, n, this._styles);
  }
  getMergeData() {
    return this._spanModel.getMergeDataSnapshot();
  }
  getMergedCell(e, n) {
    return this._spanModel.getMergedCell(e, n);
  }
  getMergedCellRange(e, n, r, s) {
    return this._spanModel.getMergedCellRange(e, n, r, s);
  }
  isRowContainsMergedCell(e) {
    return this._spanModel.isRowContainsMergedCell(e);
  }
  isColumnContainsMergedCell(e) {
    return this._spanModel.isColumnContainsMergedCell(e);
  }
  getCellInfoInMergeData(e, n) {
    let r = this.getMergedCell(e, n), s = !1, i = !1, o = e, a = n, l = e, u = n;
    if (r) {
      let { startRow: c, endRow: d, startColumn: h, endColumn: f } = r;
      e === c && n === h ? (o = d, a = f, l = c, u = h, i = !0) : e >= c && e <= d && n >= h && n <= f && (o = d, a = f, l = c, u = h, s = !0);
    }
    return { actualRow: e, actualColumn: n, isMergedMainCell: i, isMerged: s, endRow: o, endColumn: a, startRow: l, startColumn: u };
  }
  getCell(e, n) {
    return e < 0 || n < 0 ? null : this._viewModel.getCell(e, n);
  }
  getCellValueOnly(e, n) {
    return e < 0 || n < 0 ? null : this._viewModel.getCellValueOnly(e, n);
  }
  getCellStyleOnly(e, n) {
    return e < 0 || n < 0 ? null : this._viewModel.getCellStyleOnly(e, n);
  }
  getCellRaw(e, n) {
    return this.getCellMatrix().getValue(e, n);
  }
  getCellWithFilteredInterceptors(e, n, r, s) {
    return this._viewModel.getCell(e, n, r, s);
  }
  getRowFiltered(e) {
    return this._viewModel.getRowFiltered(e);
  }
  getRangeFilterRows(e) {
    let n = [];
    for (let r = e.startRow; r <= e.endRow; r++) this.getRowFiltered(r) && n.push(r);
    return n;
  }
  getMatrixWithMergedCells(e, n, r, s, i = is.Raw) {
    let o = this.getCellMatrix(), a = this._spanModel.getMergedCellRange(e, n, r, s), l = new An();
    return ru(e, r, n, s).forEach((u, c) => {
      let d;
      if (i === is.Raw) d = this.getCellRaw(u, c);
      else if (i === is.Intercepted) d = this.getCell(u, c);
      else if (i === is.Both) {
        let f = this.getCellRaw(u, c);
        if (f) {
          var h;
          d = { ...f };
          let p = (h = this.getCell(u, c)) == null ? void 0 : h.v;
          QE(p) && d && (d.displayV = String(p));
        }
      }
      d && l.setValue(u, c, d);
    }), a.forEach((u) => {
      let { startColumn: c, startRow: d, endColumn: h, endRow: f } = u;
      ru(d, f, c, h).forEach((p, g) => {
        p === d && g === c && l.setValue(p, g, { ...o.getValue(p, g), rowSpan: f - d + 1, colSpan: h - c + 1 }), (p !== d || g !== c) && l.realDeleteValue(p, g);
      });
    }), l;
  }
  getRange(e, n, r, s) {
    return typeof e == "object" ? new Ls(this, e, { getStyles: () => this._styles }) : new Ls(this, { startRow: e, startColumn: n, endColumn: s || n, endRow: r || e }, { getStyles: () => this._styles });
  }
  getScrollLeftTopFromSnapshot() {
    return { scrollLeft: this._snapshot.scrollLeft, scrollTop: this._snapshot.scrollTop };
  }
  getZoomRatio() {
    return this._snapshot.zoomRatio || 1;
  }
  getConfig() {
    return this._snapshot;
  }
  getFreeze() {
    return this._snapshot.freeze;
  }
  getMaxColumns() {
    let { _snapshot: e } = this, { columnCount: n } = e;
    return n;
  }
  getMaxRows() {
    let { _snapshot: e } = this, { rowCount: n } = e;
    return n;
  }
  getRowCount() {
    return this._snapshot.rowCount;
  }
  setRowCount(e) {
    this._snapshot.rowCount = e;
  }
  getColumnCount() {
    return this._snapshot.columnCount;
  }
  setColumnCount(e) {
    this._snapshot.columnCount = e;
  }
  isSheetHidden() {
    return this._snapshot.hidden;
  }
  hasHiddenGridlines() {
    let { _snapshot: e } = this, { showGridlines: n } = e;
    return n === 0;
  }
  getGridlinesColor() {
    return this.getConfig().gridlinesColor;
  }
  getTabColor() {
    let { _snapshot: e } = this, { tabColor: n } = e;
    return n;
  }
  getColumnWidth(e) {
    return this.getColumnManager().getColumnWidth(e);
  }
  getRowHeight(e) {
    return this._viewModel.getRowFiltered(e) ? 0 : this.getRowManager().getRowHeight(e);
  }
  isRowFiltered(e) {
    return this._viewModel.getRowFiltered(e);
  }
  getRowVisible(e) {
    return !this.isRowFiltered(e) && this.getRowRawVisible(e);
  }
  getRowRawVisible(e) {
    return this.getRowManager().getRowRawVisible(e);
  }
  getHiddenRows(e, n) {
    let r = this.getMaxColumns() - 1, s = this._rowManager.getHiddenRows(e, n);
    return s.forEach((i) => i.endColumn = r), s;
  }
  getColVisible(e) {
    return this._columnManager.getColVisible(e);
  }
  getHiddenCols(e, n) {
    let r = this.getMaxRows() - 1, s = this._columnManager.getHiddenCols(e, n);
    return s.forEach((i) => i.endRow = r), s;
  }
  getVisibleRows() {
    let e = this.getRowCount();
    return this._rowManager.getVisibleRows(0, e - 1);
  }
  getVisibleCols() {
    let e = this.getColumnCount();
    return this._columnManager.getVisibleCols(0, e - 1);
  }
  isRightToLeft() {
    let { _snapshot: e } = this, { rightToLeft: n } = e;
    return n;
  }
  getLastRowWithContent() {
    return this._cellData.getRealRowRange().endRow;
  }
  getLastColumnWithContent() {
    return this.getDataRealRange().endColumn;
  }
  getDataRealRange() {
    return this._cellData.getRealRange();
  }
  getDataRangeScope() {
    return this._cellData.getStartEndScope();
  }
  cellHasValue(e) {
    return e && (e.v !== void 0 || e.f !== void 0 || e.p !== void 0);
  }
  iterateByRow(e, n = !0) {
    let { startRow: r, startColumn: s, endRow: i, endColumn: o } = e, a = this;
    return { [Symbol.iterator]: () => {
      let l = r, u = s;
      return { next() {
        for (; ; ) {
          if (u > o && (l += 1, u = s), l > i) return { done: !0, value: void 0 };
          let c = a.getCell(l, u), d = !c, h = a.getMergedCell(l, u);
          if (h) {
            if (l !== h.startRow || u !== h.startColumn) {
              u = h.endColumn + 1;
              continue;
            }
            if (d && n) {
              u = h.endColumn + 1;
              continue;
            }
            let f = { row: l, col: u, value: c };
            return f.colSpan = h.endColumn - h.startColumn + 1, f.rowSpan = h.endRow - h.startRow + 1, u = h.endColumn + 1, { done: !1, value: f };
          }
          if (d && n) u += 1;
          else {
            let f = { row: l, col: u, value: c };
            return u += 1, { done: !1, value: f };
          }
        }
      } };
    } };
  }
  iterateByColumn(e, n = !0, r = !0) {
    let { startRow: s, startColumn: i, endRow: o, endColumn: a } = e, l = this;
    return { [Symbol.iterator]: () => {
      let u = s, c = i;
      return { next() {
        for (; ; ) {
          if (u > o && (c += 1, u = s), c > a) return { done: !0, value: void 0 };
          let d = l.getMergedCell(u, c);
          if (d) {
            let f = u !== d.startRow, p = f || c !== d.startColumn;
            if (r && p || !r && f) {
              u = d.endRow + 1;
              continue;
            }
            let g = l.getCell(d.startRow, d.startColumn);
            if (!g && n) {
              u = d.endRow + 1;
              continue;
            }
            let _ = { row: u, col: d.startColumn, value: g };
            return _.colSpan = d.endColumn - d.startColumn + 1, _.rowSpan = d.endRow - d.startRow + 1, u = d.endRow + 1, { done: !1, value: _ };
          }
          let h = l.getCell(u, c);
          if (!h && n) u += 1;
          else {
            let f = { row: u, col: c, value: h };
            return u += 1, { done: !1, value: f };
          }
        }
      } };
    } };
  }
  getCellDocumentModel(e, n, r = mu) {
    var s;
    if (!e) return;
    let { isDeepClone: i, displayRawFormula: o, ignoreTextRotation: a } = { ...mu, ...r }, l, u = "document", c = KE(n), d = a ? pe.tr : c.textRotation || pe.tr, h = c.horizontalAlign || pe.ht, f = c.verticalAlign || pe.vt, p = c.wrapStrategy || pe.tb, g = c.paddingData || lo;
    if (e.f && o) l = ms(e.f.toString(), {}, { verticalAlign: f }), h = pe.ht;
    else if (e.p) {
      let { centerAngle: _, vertexAngle: C } = kd(d);
      l = this._updateConfigAndGetDocumentModel(i ? j.deepClone(e.p) : e.p, h, g, { horizontalAlign: h, verticalAlign: f, centerAngle: _, vertexAngle: C, wrapStrategy: p, zeroWidthParagraphBreak: 1 });
    } else if (e.v != null) {
      let _ = fu(n);
      u = pu(_).fontCache;
      let C = lv(e);
      e.t === Xn.FORCE_STRING && o && (C = `'${C}`), l = ms(C, _, { ...c, textRotation: d, cellValueType: e.t });
    }
    return l && e.linkUrl && e.linkId && XE(l, e.linkUrl, e.linkId), { documentModel: l, fontString: u, textRotation: d, wrapStrategy: p, verticalAlign: f, horizontalAlign: h, paddingData: g, fill: n == null || (s = n.bg) == null ? void 0 : s.rgb };
  }
  _updateConfigAndGetDocumentModel(e, n, r, s) {
    var i, o, a, l, u;
    if (!s || !((i = e.body) != null && i.dataStream)) return;
    e.documentStyle || (e.documentStyle = {}), e.documentStyle.marginTop = (o = r.t) == null ? 0 : o, e.documentStyle.marginBottom = (a = r.b) == null ? 2 : a, e.documentStyle.marginLeft = (l = r.l) == null ? 2 : l, e.documentStyle.marginRight = (u = r.r) == null ? 2 : u, e.documentStyle.pageSize = { width: 1 / 0, height: 1 / 0 }, e.documentStyle.renderConfig = { ...e.documentStyle.renderConfig, ...s };
    let c = e.body.paragraphs || [];
    for (let d of c) d.paragraphStyle || (d.paragraphStyle = {}), d.paragraphStyle.horizontalAlign = n;
    return new xn(e);
  }
  getBlankCellDocumentModel(e, n, r) {
    let s = this.getComposedCellStyleByCellData(n, r, e), i = fu(s), o = this.getCellDocumentModel(e, s, { ignoreTextRotation: !0 });
    if (o != null) return o.documentModel == null && (o.documentModel = ms("", i)), o;
    let a = "document", l = pe.tr, u = pe.ht, c = pe.vt, d = pe.tb, h = lo;
    return a = pu({}).fontCache, { documentModel: ms("", i), fontString: a, textRotation: l, wrapStrategy: d, verticalAlign: c, horizontalAlign: u, paddingData: h };
  }
  getCellDocumentModelWithFormula(e, n, r) {
    let s = this.getComposedCellStyleByCellData(n, r, e);
    return this.getCellDocumentModel(e, s, { isDeepClone: !0, displayRawFormula: !0, ignoreTextRotation: !0 });
  }
  getCustomMetadata() {
    return this._snapshot.custom;
  }
  setCustomMetadata(e) {
    this._snapshot.custom = e;
  }
};
function lv(t) {
  var e;
  if (!t) return "";
  let n = (e = t.p) == null || (e = e.body) == null ? void 0 : e.dataStream;
  if (n) return oe.transform.getPlainText(n);
  let r = t.v;
  return typeof r == "string" ? t.t === Xn.BOOLEAN ? r.toUpperCase() : r.replace(/[\r\n]/g, "") : typeof r == "number" ? t.t === Xn.BOOLEAN ? r ? "TRUE" : "FALSE" : r.toString() : typeof r == "boolean" ? r ? "TRUE" : "FALSE" : "";
}
function cb(t) {
  if (t === null) return "";
  if (t != null && t.p) {
    let e = t == null ? void 0 : t.p.body;
    if (e == null) return "";
    let n = e.dataStream;
    return oe.transform.getPlainText(n);
  }
  return t == null ? void 0 : t.v;
}
function db(t, e) {
  return `${t.getUnitId()}|${e.getSheetId()}`;
}
let Fs = class extends ba {
  get _activeSheet() {
    return this._activeSheet$.getValue();
  }
  get name() {
    return this._name$.getValue();
  }
  static isIRangeType(t) {
    return typeof t == "string" || "startRow" in t || "row" in t;
  }
  constructor(t = {}, e) {
    super(), this._logService = e, y(this, "type", Et.UNIVER_SHEET), y(this, "_sheetCreated$", new ae()), y(this, "sheetCreated$", this._sheetCreated$.asObservable()), y(this, "_sheetDisposed$", new ae()), y(this, "sheetDisposed$", this._sheetDisposed$.asObservable()), y(this, "_activeSheet$", new de(null)), y(this, "activeSheet$", this._activeSheet$.asObservable()), y(this, "_worksheets", void 0), y(this, "_styles", void 0), y(this, "_snapshot", void 0), y(this, "_unitId", void 0), y(this, "_count", void 0), y(this, "_name$", void 0), y(this, "name$", void 0);
    let n = GE();
    j.isEmptyObject(t) ? this._snapshot = n : this._snapshot = j.commonExtend(n, t);
    let { styles: r } = this._snapshot;
    (this._snapshot.id == null || this._snapshot.id.length === 0) && (this._snapshot.id = ce(6)), this._unitId = this._snapshot.id, this._styles = new YE(r), this._count = 1, this._worksheets = /* @__PURE__ */ new Map(), this._name$ = new de(t.name || ""), this.name$ = this._name$.asObservable(), this._parseWorksheetSnapshots();
  }
  dispose() {
    super.dispose(), this._sheetCreated$.complete(), this._sheetDisposed$.complete(), this._activeSheet$.complete(), this._name$.complete(), Array.from(this._worksheets.keys()).forEach((t) => {
      this._removeSheet(t);
    });
  }
  save() {
    return j.deepClone(this._snapshot);
  }
  getSnapshot() {
    return this._snapshot;
  }
  getName() {
    return this._snapshot.name;
  }
  setName(t) {
    this._name$.next(t), this._snapshot.name = t;
  }
  getUnitId() {
    return this._unitId;
  }
  getRev() {
    var t;
    return (t = this._snapshot.rev) == null ? 1 : t;
  }
  incrementRev() {
    this._snapshot.rev = this.getRev() + 1;
  }
  setRev(t) {
    this._snapshot.rev = t;
  }
  addWorksheet(t, e, n) {
    let { sheets: r, sheetOrder: s } = this._snapshot;
    if (r[t]) return !1;
    r[t] = n, s.splice(e, 0, t), this.ensureSheetOrderUnique();
    let i = new _u(this._unitId, n, this._styles);
    return this._worksheets.set(t, i), this._sheetCreated$.next(i), !0;
  }
  getSheetOrders() {
    return this._snapshot.sheetOrder;
  }
  ensureSheetOrderUnique() {
    let t = /* @__PURE__ */ new Set(), e = [];
    for (let n of this._snapshot.sheetOrder) t.has(n) || (t.add(n), e.push(n));
    this._snapshot.sheetOrder = e, t.clear();
  }
  getWorksheets() {
    return this._worksheets;
  }
  getActiveSpreadsheet() {
    return this;
  }
  getStyles() {
    return this._styles;
  }
  addStyles(t) {
    Object.entries(t).forEach(([e, n]) => {
      this._styles.addCustomStyle(e, n);
    });
  }
  removeStyles(t) {
    t.forEach((e) => {
      this._styles.remove(e);
    });
  }
  getConfig() {
    return this._snapshot;
  }
  getIndexBySheetId(t) {
    let { sheetOrder: e } = this._snapshot;
    return e.findIndex((n) => n === t);
  }
  getActiveSheet(t) {
    if (!this._activeSheet && t === void 0) throw Error(`[Workbook]: no active Worksheet on Workbook ${this._unitId}!`);
    return this._activeSheet;
  }
  ensureActiveSheet() {
    let t = this._activeSheet;
    if (t) return t;
    let e = this._snapshot.sheetOrder;
    for (let r = 0, s = e.length; r < s; r++) {
      let i = this._worksheets.get(e[r]);
      if (i && i.isSheetHidden() !== z.TRUE) return this.setActiveSheet(i), i;
    }
    let n = this._worksheets.get(e[0]);
    return this.setActiveSheet(n), n;
  }
  setActiveSheet(t) {
    this._activeSheet$.next(t);
  }
  _removeSheet(t) {
    let e = this._worksheets.get(t);
    return e ? (this._worksheets.delete(t), this._snapshot.sheetOrder.splice(this._snapshot.sheetOrder.indexOf(t), 1), this.ensureSheetOrderUnique(), this._sheetDisposed$.next(e), !0) : !1;
  }
  removeSheet(t) {
    let e = this._removeSheet(t);
    return e && delete this._snapshot.sheets[t], e;
  }
  getActiveSheetIndex() {
    let { sheetOrder: t } = this._snapshot;
    return t.findIndex((e) => this._worksheets.get(e) === this._activeSheet);
  }
  getSheetSize() {
    return this._snapshot.sheetOrder.length;
  }
  getSheets() {
    let { sheetOrder: t } = this._snapshot;
    return t.map((e) => this._worksheets.get(e));
  }
  getSheetsName() {
    let { sheetOrder: t } = this._snapshot, e = [];
    return t.forEach((n) => {
      let r = this._worksheets.get(n);
      r && e.push(r.getName());
    }), e;
  }
  getSheetIndex(t) {
    let { sheetOrder: e } = this._snapshot;
    return e.findIndex((n) => t.getSheetId() === n);
  }
  getSheetBySheetName(t) {
    let { sheetOrder: e } = this._snapshot, n = e.find((r) => this._worksheets.get(r).getName() === t);
    return this._worksheets.get(n);
  }
  getSheetBySheetId(t) {
    return this._worksheets.get(t);
  }
  getSheetByIndex(t) {
    let { sheetOrder: e } = this._snapshot;
    return this._worksheets.get(e[t]);
  }
  getHiddenWorksheets() {
    return this.getSheets().filter((t) => t.getConfig().hidden === z.TRUE).map((t) => t.getConfig().id);
  }
  getUnhiddenWorksheets() {
    return this.getSheets().filter((t) => t.getConfig().hidden !== z.TRUE).map((t) => t.getConfig().id);
  }
  load(t) {
    this._snapshot = t;
  }
  checkSheetName(t) {
    return this.getSheetsName().some((e) => e.toLowerCase() === t.toLowerCase());
  }
  uniqueSheetName(t = "Sheet1") {
    let e = t;
    for (; this.checkSheetName(e); ) e = t + this._count, this._count++;
    return e;
  }
  generateNewSheetName(t) {
    let e = t + this._count;
    for (; this.checkSheetName(e); ) e = t + this._count, this._count++;
    return e;
  }
  _parseWorksheetSnapshots() {
    let { _snapshot: t, _worksheets: e } = this, { sheets: n, sheetOrder: r } = t;
    if (j.isEmptyObject(n)) {
      let s = ce();
      n[s] = { id: s };
    }
    for (let s in n) {
      let i = n[s], { name: o } = i;
      i.name = this.uniqueSheetName(o), i.name !== o && this._logService.debug("[Workbook]", `The worksheet name ${o} is duplicated, we changed it to ${i.name}. Please fix the problem in your snapshot.`);
      let a = new _u(this._unitId, i, this._styles);
      e.set(s, a), r.includes(s) || r.push(s);
    }
    this.ensureSheetOrderUnique(), this.ensureActiveSheet();
  }
  getCustomMetadata() {
    return this._snapshot.custom;
  }
  setCustomMetadata(t) {
    this._snapshot.custom = t;
  }
};
Fs = Ue([Ut(1, De)], Fs);
var Hd = class extends ba {
  get _activePage() {
    let t = this._activePage$.getValue();
    if (!t) {
      var e, n;
      let r = (e = this.getPageOrder()) == null ? void 0 : e[0];
      return r ? (n = this.getPages()) == null ? void 0 : n[r] : null;
    }
    return t;
  }
  constructor(t) {
    var e;
    super(), y(this, "type", Et.UNIVER_SLIDE), y(this, "_activePage$", new de(null)), y(this, "activePage$", this._activePage$.asObservable()), y(this, "_name$", void 0), y(this, "name$", void 0), y(this, "_snapshot", void 0), y(this, "_unitId", void 0), this._snapshot = { ...yy, ...t }, this._unitId = (e = this._snapshot.id) == null ? ce(6) : e, this._name$ = new de(this._snapshot.title), this.name$ = this._name$.asObservable();
  }
  setName(t) {
    var e;
    this._snapshot.title = t, this._name$.next(t), this._unitId = (e = this._snapshot.id) == null ? ce(6) : e;
  }
  getRev() {
    return 0;
  }
  incrementRev() {
  }
  setRev(t) {
  }
  getSnapshot() {
    return this._snapshot;
  }
  getUnitId() {
    return this._unitId;
  }
  getPages() {
    var t;
    return (t = this._snapshot.body) == null ? void 0 : t.pages;
  }
  getPageOrder() {
    var t;
    return (t = this._snapshot.body) == null ? void 0 : t.pageOrder;
  }
  getPage(t) {
    let e = this.getPages();
    return e == null ? void 0 : e[t];
  }
  getElementsByPage(t) {
    var e;
    return (e = this.getPage(t)) == null ? void 0 : e.pageElements;
  }
  getElement(t, e) {
    var n;
    return (n = this.getElementsByPage(t)) == null ? void 0 : n[e];
  }
  getPageSize() {
    return this._snapshot.pageSize;
  }
  getBlankPage() {
    let t = ce(6);
    return { id: t, pageType: A_.SLIDE, zIndex: 10, title: t, description: "", pageBackgroundFill: { rgb: "rgb(255,255,255)" }, pageElements: {} };
  }
  setActivePage(t) {
    this._activePage$.next(t);
  }
  getActivePage() {
    return this._activePage;
  }
  updatePage(t, e) {
    this._snapshot.body && (this._snapshot.body.pages[t] = e);
  }
  appendPage(t) {
    var e;
    if (!this._snapshot.body) return;
    this._snapshot.body.pages[t.id] = t;
    let n = this._activePage, r = this._snapshot.body.pageOrder.indexOf((e = n == null ? void 0 : n.id) == null ? "" : e);
    this._snapshot.body.pageOrder.splice(r + 1, 0, t.id);
  }
};
const jr = me("univer.current");
let uo = class extends Qt {
  constructor(t, e, n) {
    super(), this._injector = t, this._contextService = e, this._logService = n, y(this, "_unitsByType", /* @__PURE__ */ new Map()), y(this, "_createHandler", void 0), y(this, "_ctorByType", /* @__PURE__ */ new Map()), y(this, "_currentUnits", /* @__PURE__ */ new Map()), y(this, "_currentUnits$", new de(this._currentUnits)), y(this, "currentUnits$", this._currentUnits$.asObservable()), y(this, "_unitAdded$", new ae()), y(this, "unitAdded$", this._unitAdded$.asObservable()), y(this, "_unitDisposed$", new ae()), y(this, "unitDisposed$", this._unitDisposed$.asObservable()), y(this, "_focused$", new de(null)), y(this, "focused$", this._focused$.asObservable());
  }
  dispose() {
    super.dispose(), this._focused$.complete(), this._currentUnits$.complete(), this._unitAdded$.complete(), this._currentUnits.forEach((t) => t == null ? void 0 : t.dispose()), this._currentUnits.clear(), this._unitsByType.clear();
  }
  __setCreateHandler(t) {
    this._createHandler = t;
  }
  createUnit(t, e, n) {
    return this._createHandler(t, e, this._ctorByType.get(t), n);
  }
  registerCtorForType(t, e) {
    return this._ctorByType.set(t, e), { dispose: () => {
      this._ctorByType.delete(t);
    } };
  }
  getCurrentTypeOfUnit$(t) {
    return this.currentUnits$.pipe(or((e) => {
      var n;
      return (n = e.get(t)) == null ? null : n;
    }), dm());
  }
  getCurrentUnitForType(t) {
    return this._currentUnits.get(t);
  }
  getCurrentUnitOfType(t) {
    return this.getCurrentUnitForType(t);
  }
  setCurrentUnitForType(t) {
    let e = this._getUnitById(t);
    if (!e) throw Error(`[UniverInstanceService]: no document with unitId ${t}!`);
    this._currentUnits.set(e[1], e[0]), this._currentUnits$.next(this._currentUnits);
  }
  getTypeOfUnitAdded$(t) {
    return this._unitAdded$.pipe(mn((e) => e.type === t));
  }
  __addUnit(t, e) {
    var n;
    this._logService.debug(`[UniverInstanceService]: Adding unit with id ${t.getUnitId()}`);
    let r = t.type;
    this._unitsByType.has(r) || this._unitsByType.set(r, []);
    let s = this._unitsByType.get(r), i = t.getUnitId();
    if (s.findIndex((o) => o.getUnitId() === i) !== -1) throw Error(`[UniverInstanceService]: cannot create a unit with the same unit id: ${i}.`);
    s.push(t), this._unitAdded$.next(t), ((n = e == null ? void 0 : e.makeCurrent) == null || n) && this.setCurrentUnitForType(t.getUnitId());
  }
  getTypeOfUnitDisposed$(t) {
    return this.unitDisposed$.pipe(mn((e) => e.type === t));
  }
  getUnit(t, e) {
    var n;
    let r = (n = this._getUnitById(t)) == null ? void 0 : n[0];
    return e && (r == null ? void 0 : r.type) !== e ? null : r;
  }
  getCurrentUniverDocInstance() {
    return this.getCurrentUnitForType(Et.UNIVER_DOC);
  }
  getUniverDocInstance(t) {
    return this.getUnit(t, Et.UNIVER_DOC);
  }
  getUniverSheetInstance(t) {
    return this.getUnit(t, Et.UNIVER_SHEET);
  }
  getAllUnitsForType(t) {
    var e;
    return (e = this._unitsByType.get(t)) == null ? [] : e;
  }
  changeDoc(t, e) {
    let n = this.getAllUnitsForType(Et.UNIVER_DOC), r = n.find((s) => s.getUnitId() === t);
    if (r != null) {
      let s = n.indexOf(r);
      n.splice(s, 1);
    }
    this.__addUnit(e);
  }
  get focused() {
    var t;
    let e = this._focused$.getValue();
    return e ? (t = this._getUnitById(e)) == null ? void 0 : t[0] : null;
  }
  focusUnit(t) {
    this._focused$.next(t), this.focused instanceof Fs ? (this._contextService.setContextValue(fs, !0), this._contextService.setContextValue(ps, !1), this._contextService.setContextValue(Sr, !0), this._contextService.setContextValue(gs, !1), this.setCurrentUnitForType(t)) : this.focused instanceof xn ? (this._contextService.setContextValue(fs, !0), this._contextService.setContextValue(ps, !0), this._contextService.setContextValue(Sr, !1), this._contextService.setContextValue(gs, !1), this.setCurrentUnitForType(t)) : this.focused instanceof Hd ? (this._contextService.setContextValue(fs, !0), this._contextService.setContextValue(ps, !1), this._contextService.setContextValue(Sr, !1), this._contextService.setContextValue(gs, !0), this.setCurrentUnitForType(t)) : (this._contextService.setContextValue(fs, !1), this._contextService.setContextValue(ps, !1), this._contextService.setContextValue(Sr, !1), this._contextService.setContextValue(gs, !1));
  }
  getFocusedUnit() {
    return this.focused;
  }
  getUnitType(t) {
    let e = this._getUnitById(t);
    return e ? e[1] : Et.UNRECOGNIZED;
  }
  disposeUnit(t) {
    this._logService.debug(`[UniverInstanceService]: Disposing unit with id ${t}`);
    let e = this._getUnitById(t);
    if (!e) return this._logService.debug(`[UniverInstanceService]: No unit found with id ${t}`), !1;
    let [n, r] = e, s = this._unitsByType.get(r), i = s.indexOf(n);
    return s.splice(i, 1), this._tryResetCurrentOnRemoval(t, r), this._tryResetFocusOnRemoval(t), this._unitDisposed$.next(n), n.dispose(), !0;
  }
  _tryResetCurrentOnRemoval(t, e) {
    let n = this.getCurrentUnitForType(e);
    (n == null ? void 0 : n.getUnitId()) === t && (this._currentUnits.set(e, null), this._currentUnits$.next(this._currentUnits));
  }
  _tryResetFocusOnRemoval(t) {
    var e;
    ((e = this.focused) == null ? void 0 : e.getUnitId()) === t && this._focused$.next(null);
  }
  _getUnitById(t) {
    for (let [e, n] of this._unitsByType) {
      let r = n.find((s) => s.getUnitId() === t);
      if (r) return [r, e];
    }
  }
};
uo = Ue([Ut(0, Le(Nn)), Ut(1, Wr), Ut(2, Le(De))], uo);
let Ot = function(t) {
  return t[t.Starting = 0] = "Starting", t[t.Ready = 1] = "Ready", t[t.Rendered = 2] = "Rendered", t[t.Steady = 3] = "Steady", t;
}({});
const jd = { [Ot.Starting]: "Starting", [Ot.Ready]: "Ready", [Ot.Rendered]: "Rendered", [Ot.Steady]: "Steady" };
var uv = class extends Error {
  constructor(t) {
    super(`[LifecycleService]: lifecycle stage "${jd[t]}" will never be reached!`), this.name = "LifecycleUnreachableError";
  }
};
let tr = class extends Qt {
  constructor(t) {
    super(), this._logService = t, y(this, "_lifecycle$", new de(Ot.Starting)), y(this, "lifecycle$", this._lifecycle$.asObservable()), y(this, "_lock", !1), this._reportProgress(Ot.Starting);
  }
  get stage() {
    return this._lifecycle$.getValue();
  }
  set stage(t) {
    if (this._lock) throw Error("[LifecycleService]: cannot set new stage when related logic is all handled!");
    if (t < this.stage) throw Error("[LifecycleService]: lifecycle stage cannot go backward!");
    t !== this.stage && (this._lock = !0, this._reportProgress(t), this._lifecycle$.next(t), this._lock = !1);
  }
  dispose() {
    this._lifecycle$.complete(), super.dispose();
  }
  onStage(t) {
    return zg(this.lifecycle$.pipe(mn((e) => e >= t), Wl((e) => e === t), or(() => {
    }))).catch((e) => e.name === "EmptyError" ? Promise.reject(new uv(t)) : Promise.reject(e));
  }
  subscribeWithPrevious() {
    return hc($d(this.stage), this._lifecycle$.pipe(gc(1))).pipe(Wl((t) => t === Ot.Steady));
  }
  _reportProgress(t) {
    this._logService.debug("[LifecycleService]", `lifecycle progressed to "${jd[t]}".`);
  }
};
tr = Ue([Ut(0, De)], tr);
function $d(t) {
  switch (t) {
    case Ot.Starting:
      return zr(Ot.Starting);
    case Ot.Ready:
      return zr(Ot.Starting, Ot.Ready);
    case Ot.Rendered:
      return zr(Ot.Starting, Ot.Ready, Ot.Rendered);
    default:
      return zr(Ot.Starting, Ot.Ready, Ot.Rendered, Ot.Steady);
  }
}
const hb = me("ILocalStorageService");
var Qn = class extends Qt {
  get _currentLocale() {
    return this._currentLocale$.value;
  }
  constructor() {
    super(), y(this, "_currentLocale$", new de(Ta.ZH_CN)), y(this, "currentLocale$", this._currentLocale$.asObservable()), y(this, "_locales", null), y(this, "localeChanged$", new ae()), y(this, "t", (t, ...e) => {
      if (!this._locales) throw Error("[LocaleService]: Locale not initialized");
      let n = t.split("."), r = this.resolveKeyPath(this._locales[this._currentLocale], n);
      if (typeof r == "string") {
        let s = r;
        return e.forEach((i, o) => {
          s = s.replace(`{${o}}`, i);
        }), s;
      } else return t;
    }), this.disposeWithMe(Gt(() => {
      this._locales = null, this._currentLocale$.complete(), this.localeChanged$.complete();
    }));
  }
  load(t) {
    var e;
    this._locales = So((e = this._locales) == null ? {} : e, t);
  }
  setLocale(t) {
    this._currentLocale$.next(t), this.localeChanged$.next();
  }
  getLocales() {
    var t;
    return (t = this._locales) == null ? void 0 : t[this._currentLocale];
  }
  getCurrentLocale() {
    return this._currentLocale;
  }
  resolveKeyPath(t, e) {
    let n = e.shift();
    if (n && t && n in t) {
      let r = t[n];
      return e.length > 0 && (typeof r == "object" || Array.isArray(r)) ? this.resolveKeyPath(r, e) : r;
    }
    return null;
  }
};
let co = class {
  constructor(t) {
    this._userManagerService = t;
  }
  async list(t) {
    return { list: [{ type: Hl.PERSON, mentions: [{ objectType: Hl.PERSON, objectId: this._userManagerService.getCurrentUser().userID, label: this._userManagerService.getCurrentUser().name, metadata: { icon: this._userManagerService.getCurrentUser().avatar } }], metadata: {}, title: "PEOPLE" }], page: t.page, size: t.size, total: 1 };
  }
};
co = Ue([Ut(0, Le(xs))], co);
const cv = me("univer.service.mention-io");
let dv = function(t) {
  return t.INIT = "init", t.FETCHING = "fetching", t.DONE = "done", t;
}({});
const hv = me("univer.permission-service");
var fv = class extends Qt {
  constructor(...t) {
    super(...t), y(this, "_permissionPointMap", /* @__PURE__ */ new Map()), y(this, "_permissionPointUpdate$", new ae()), y(this, "permissionPointUpdate$", this._permissionPointUpdate$.asObservable()), y(this, "_showComponents", !0);
  }
  setShowComponents(t) {
    this._showComponents = t;
  }
  getShowComponents() {
    return this._showComponents;
  }
  deletePermissionPoint(t) {
    let e = this._permissionPointMap.get(t);
    e && (e.complete(), this._permissionPointMap.delete(t));
  }
  addPermissionPoint(t) {
    let e = t instanceof de, n = e ? t.getValue() : t;
    return n.id ? this._permissionPointMap.get(n.id) ? (console.warn(`${n.id} PermissionPoint already exists`), !1) : (this._permissionPointMap.set(n.id, e ? t : new de(n)), this._permissionPointUpdate$.next(n), !0) : !1;
  }
  updatePermissionPoint(t, e) {
    let n = this._permissionPointMap.get(t);
    if (!n) return;
    let r = n.getValue();
    r.value = e, r.status = dv.DONE, n.next(r), this._permissionPointUpdate$.next(r);
  }
  clearPermissionMap() {
    this._permissionPointMap.clear();
  }
  getPermissionPoint(t) {
    let e = this._permissionPointMap.get(t);
    if (e) return e.getValue();
  }
  getPermissionPoint$(t) {
    let e = this._permissionPointMap.get(t);
    if (e) return e;
  }
  composePermission$(t) {
    return im(t.map((e) => {
      var n;
      let r = (n = this._permissionPointMap) == null ? void 0 : n.get(e);
      if (!r) throw Error(`[PermissionService]: ${e} permissionPoint does not exist!`);
      return r.asObservable();
    })).pipe(or((e) => e));
  }
  composePermission(t) {
    return t.map((e) => {
      var n;
      let r = (n = this._permissionPointMap) == null ? void 0 : n.get(e);
      if (!r) throw Error(`[PermissionService]: ${e} permissionPoint does not exist!`);
      return r.getValue();
    });
  }
  getAllPermissionPoint() {
    let t = /* @__PURE__ */ new Map();
    return this._permissionPointMap.forEach((e, n) => {
      t.set(n, e);
    }), t;
  }
};
function pv(t, e) {
  if (!e) return t;
  let n = [];
  for (let r of t) {
    let s = e.find(([i]) => i === r[0]);
    if (s) {
      if (s[1] === null) continue;
      n.push([r[0], s[1]]);
    } else n.push(r);
  }
  return n;
}
const Wd = Symbol("DependentOn");
var Yn = class extends Qt {
  onStarting() {
  }
  onReady() {
  }
  onRendered() {
  }
  onSteady() {
  }
  getUnitType() {
    return this.constructor.type;
  }
  getPluginName() {
    return this.constructor.pluginName;
  }
};
y(Yn, "pluginName", void 0), y(Yn, "packageName", VE), y(Yn, "version", Pd), y(Yn, "type", Et.UNIVER_UNKNOWN);
var gv = class {
  constructor() {
    y(this, "_plugins", []);
  }
  addPlugin(t) {
    this._plugins.push(t);
  }
  removePlugins() {
    let t = this._plugins.slice();
    return this._plugins.length = 0, t;
  }
  forEachPlugin(t) {
    this._plugins.forEach(t);
  }
};
function fb(...t) {
  return function(e) {
    e[Wd] = t;
  };
}
let Us = class {
  constructor(t, e, n) {
    this._injector = t, this._lifecycleService = e, this._logService = n, y(this, "_pluginRegistry", /* @__PURE__ */ new Map()), y(this, "_pluginStore", new gv()), y(this, "_seenPlugins", /* @__PURE__ */ new Set()), y(this, "_loadedPlugins", /* @__PURE__ */ new Set()), y(this, "_loadedPluginTypes", /* @__PURE__ */ new Set([Et.UNIVER_UNKNOWN])), y(this, "_flushTimerByType", /* @__PURE__ */ new Map());
  }
  dispose() {
    this._pluginStore.removePlugins().forEach((t) => t.dispose()), this._flushTimerByType.forEach((t) => clearTimeout(t));
  }
  registerPlugin(t, e) {
    this._assertPluginValid(t);
    let n = { plugin: t, options: e };
    this._pluginRegistry.set(t.pluginName, n), this._logService.debug("[PluginService]", `Plugin "${t.pluginName}" registered.`);
    let { type: r } = t;
    this._loadedPluginTypes.has(r) && (r === Et.UNIVER_UNKNOWN ? this._loadFromPlugins([n]) : this._flushType(r));
  }
  startPluginsForType(t) {
    this._loadedPluginTypes.has(t) || this._loadPluginsForType(t);
  }
  _loadPluginsForType(t) {
    let e = Array.from(this._pluginRegistry.keys()), n = [];
    e.forEach((r) => {
      let s = this._pluginRegistry.get(r);
      s.plugin.type === t && n.push(s);
    }), this._loadFromPlugins(n), this._loadedPluginTypes.add(t);
  }
  _assertPluginValid(t) {
    let { type: e, pluginName: n, packageName: r, version: s } = t;
    if (e === Et.UNRECOGNIZED) throw Error(`[PluginService]: invalid plugin type for ${t.name}. Please assign a "type" to your plugin.`);
    if (!n) throw Error(`[PluginService]: no plugin name for ${t.name}. Please assign a "pluginName" to your plugin.`);
    if (s && s !== Yn.version) throw Error(`[PluginService]: package "${r ?? "UNKNOWN"}" version mismatch. Plugin version is "${s}" but @univerjs/core version is "${Yn.version}". Please make sure all @univerjs packages use the same version.`);
    if (this._seenPlugins.has(n)) throw Error(`[PluginService]: duplicated plugin name for "${n}". Maybe a plugin that dependents on "${n} has already registered it. In that case please register "${n}" before the that plugin.`);
    this._seenPlugins.add(t.pluginName);
  }
  _flushType(t) {
    this._flushTimerByType.get(t) === void 0 && this._flushTimerByType.set(t, setTimeout(() => {
      this._loadPluginsForType(t), this._flushTimerByType.delete(t);
    }, 4));
  }
  _loadFromPlugins(t) {
    let e = [], n = /* @__PURE__ */ new Set(), r = (i) => {
      let { plugin: o } = i, { pluginName: a } = o;
      if (this._loadedPlugins.has(a) || n.has(a)) return;
      n.add(a), this._pluginRegistry.delete(a);
      let l = o[Wd];
      l && l.forEach((u) => {
        let c = this._pluginRegistry.get(u.pluginName);
        if (c) r(c);
        else if (!this._seenPlugins.has(u.pluginName) && !n.has(u.pluginName)) {
          if (o.type === Et.UNIVER_UNKNOWN && u.type !== Et.UNIVER_UNKNOWN) throw Error(`[PluginService]: cannot register a plugin with Univer type that depends on a plugin with other type. The dependent is ${o.pluginName} and the dependency is ${u.pluginName}.`);
          o.type !== u.type && u.type !== Et.UNIVER_UNKNOWN && this._logService.debug("[PluginService]", `Plugin "${a}" depends on "${u.pluginName}" which has different type.`), this._logService.debug("[PluginService]", `Plugin "${a}" depends on "${u.pluginName}" which is not registered. Univer will automatically register it with default configuration.`), this._assertPluginValid(u), r({ plugin: u, options: void 0 });
        }
      }), e.push(i);
    };
    t.forEach((i) => r(i));
    let s = e.map((i) => this._initPlugin(i.plugin, i.options));
    this._pluginsRunLifecycle(s);
  }
  _pluginsRunLifecycle(t) {
    let e = this._lifecycleService.stage;
    if ($d(e).subscribe((n) => this._runStage(t, n)), e !== Ot.Steady) {
      let n = this._lifecycleService.lifecycle$.pipe(gc(1)).subscribe((r) => {
        this._runStage(t, r), r === Ot.Steady && n.unsubscribe();
      });
    }
  }
  _runStage(t, e) {
    t.forEach((n) => {
      switch (e) {
        case Ot.Starting:
          n.onStarting();
          break;
        case Ot.Ready:
          n.onReady();
          break;
        case Ot.Rendered:
          n.onRendered();
          break;
        case Ot.Steady:
          n.onSteady();
          break;
      }
    });
  }
  _initPlugin(t, e) {
    let n = this._injector.createInstance(t, e);
    return this._pluginStore.addPlugin(n), this._loadedPlugins.add(t.pluginName), this._logService.debug("[PluginService]", `Plugin "${n.getPluginName()}" loaded.`), n;
  }
};
Us = Ue([Ut(0, Le(Nn)), Ut(1, Le(tr)), Ut(2, De)], Us);
const yu = me("resource-loader-service");
let ho = class extends Qt {
  constructor(t) {
    super(), this._logService = t, y(this, "_resourceMap", /* @__PURE__ */ new Map()), y(this, "_register$", new ae()), y(this, "register$", this._register$.asObservable());
  }
  getAllResourceHooks() {
    return [...this._resourceMap.values()];
  }
  getResources(t, e) {
    return e ? this.getResourcesByType(t, e) : this.getAllResourceHooks().map((n) => {
      let r = n.toJson(t);
      return { name: n.pluginName, data: r };
    });
  }
  getResourcesByType(t, e) {
    return this.getAllResourceHooks().filter((n) => n.businesses.includes(e)).map((n) => {
      let r = n.toJson(t);
      return { name: n.pluginName, data: r };
    });
  }
  registerPluginResource(t) {
    let e = t.pluginName;
    if (this._resourceMap.has(e)) throw Error(`the pluginName is registered {${e}}`);
    return this._resourceMap.set(e, t), this._register$.next(t), Gt(() => this._resourceMap.delete(e));
  }
  disposePluginResource(t) {
    this._resourceMap.delete(t);
  }
  loadResources(t, e) {
    this.getAllResourceHooks().forEach((n) => {
      var r;
      let s = e == null || (r = e.find((i) => i.name === n.pluginName)) == null ? void 0 : r.data;
      if (s) try {
        let i = n.parseJson(s);
        n.onLoad(t, i);
      } catch (i) {
        this._logService.error("[ResourceManagerService]", "loadResources error", i);
      }
    });
  }
  unloadResources(t, e) {
    this.getAllResourceHooks().filter((n) => n.businesses.includes(e)).forEach((n) => {
      n.onUnLoad(t);
    });
  }
  dispose() {
    this._register$.complete(), this._resourceMap.clear();
  }
};
ho = Ue([Ut(0, De)], ho);
var fo = class extends Qt {
  get darkMode() {
    return this._darkMode$.getValue();
  }
  constructor() {
    super(), y(this, "_darkMode$", new de(!1)), y(this, "darkMode$", this._darkMode$.asObservable()), y(this, "_validColorCache", /* @__PURE__ */ new Map()), y(this, "_currentTheme", qr), y(this, "_currentTheme$", new de(this._currentTheme)), y(this, "currentTheme$", this._currentTheme$.asObservable()), this.disposeWithMe(Gt(() => {
      this._currentTheme = qr, this._currentTheme$.complete(), this._darkMode$.complete();
    }));
  }
  isValidThemeColor(t) {
    if (this._validColorCache.has(t)) return this._validColorCache.get(t);
    let e = !1, n = t.split(".");
    if (n.length === 1) e = t in qr;
    else if (n.length === 2) {
      let [r, s] = n;
      e = r in qr && s in this._currentTheme[r];
    }
    return this._validColorCache.set(t, e), e;
  }
  getCurrentTheme() {
    return this._currentTheme;
  }
  setTheme(t) {
    this._currentTheme = t, this._currentTheme$.next(t);
  }
  setDarkMode(t) {
    this._darkMode$.next(t);
  }
  getColorFromTheme(t) {
    return Kp(this._currentTheme, t);
  }
}, Ts = function(t) {
  return t[t.WAITING = 0] = "WAITING", t[t.CREATED = 1] = "CREATED", t;
}(Ts || {});
const xa = me("univer.undo-redo.service");
var Vd = class {
  dispose() {
  }
  async dispatchToHandlers() {
    return !1;
  }
};
const mv = "univer.command.redo", _v = "univer.command.undo", yv = new class extends Vd {
  constructor(...t) {
    super(...t), y(this, "type", on.COMMAND), y(this, "id", _v);
  }
  handler(t) {
    let e = t.get(xa), n = e.pitchTopUndoElement();
    if (!n) return !1;
    let r = t.get(Js);
    return wa(n.undoMutations, r) ? (e.popUndoToRedo(), !0) : !1;
  }
}(), Ev = new class extends Vd {
  constructor(...t) {
    super(...t), y(this, "type", on.COMMAND), y(this, "id", mv);
  }
  handler(t) {
    let e = t.get(xa), n = e.pitchTopRedoElement();
    if (!n) return !1;
    let r = t.get(Js);
    return wa(n.redoMutations, r) ? (e.popRedoToUndo(), !0) : !1;
  }
}();
let po = class extends Qt {
  constructor(t, e, n) {
    super(), this._univerInstanceService = t, this._commandService = e, this._contextService = n, y(this, "undoRedoStatus$", void 0), y(this, "_undoRedoStatus$", new de({ undos: 0, redos: 0 })), y(this, "_undoStacks", /* @__PURE__ */ new Map()), y(this, "_redoStacks", /* @__PURE__ */ new Map()), y(this, "_batchingStatus", /* @__PURE__ */ new Map()), this.undoRedoStatus$ = this._undoRedoStatus$.asObservable(), this.disposeWithMe(this._commandService.registerCommand(yv)), this.disposeWithMe(this._commandService.registerCommand(Ev)), this.disposeWithMe(Gt(() => this._undoRedoStatus$.complete())), this.disposeWithMe(Gt(this._univerInstanceService.focused$.subscribe(() => this._updateStatus())));
  }
  pushUndoRedo(t) {
    let { unitID: e } = t, n = this._getRedoStack(e, !0), r = this._getUndoStack(e, !0);
    if (n.length = 0, this._batchingStatus.has(t.unitID)) {
      let i = this._batchingStatus.get(t.unitID), o = this._pitchUndoElement(t.unitID);
      i === Ts.WAITING || !o ? (s(t), this._batchingStatus.set(t.unitID, Ts.CREATED)) : this._tryBatchingElements(o, t);
    } else s(t);
    function s(i) {
      r.push(i), r.length > 20 && r.splice(0, 1);
    }
    this._updateStatus();
  }
  clearUndoRedo(t) {
    let e = this._getRedoStack(t);
    e && (e.length = 0);
    let n = this._getUndoStack(t);
    n && (n.length = 0), this._updateStatus();
  }
  pitchTopUndoElement() {
    let t = this._getFocusedUnitId();
    return this._pitchUndoElement(t);
  }
  pitchTopRedoElement() {
    let t = this._getFocusedUnitId();
    return this._pitchRedoElement(t);
  }
  _pitchUndoElement(t) {
    let e = this._getUndoStack(t);
    return e != null && e.length ? e[e.length - 1] : null;
  }
  _pitchRedoElement(t) {
    let e = this._getRedoStack(t);
    return e != null && e.length ? e[e.length - 1] : null;
  }
  popUndoToRedo() {
    let t = this._getUndoStackForFocused().pop();
    t && (t.redoMutations.length > 0 && this._getRedoStackForFocused().push(t), this._updateStatus());
  }
  popRedoToUndo() {
    let t = this._getRedoStackForFocused().pop();
    t && (this._getUndoStackForFocused().push(t), this._updateStatus());
  }
  rollback(t, e) {
    let n = e || this._getFocusedUnitId(), r = this._getUndoStack(n), s = r == null ? void 0 : r[(r == null ? void 0 : r.length) - 1];
    s && s.id === t && (r.pop(), wa(s.undoMutations, this._commandService));
  }
  __tempBatchingUndoRedo(t) {
    if (this._batchingStatus.has(t)) throw Error("[LocalUndoRedoService]: cannot batching undo redo twice at the same time!");
    return this._batchingStatus.set(t, Ts.WAITING), Gt(() => this._batchingStatus.delete(t));
  }
  _updateStatus() {
    var t, e;
    let n = this._getFocusedUnitId(), r = n && ((t = this._undoStacks.get(n)) == null ? void 0 : t.length) || 0, s = n && ((e = this._redoStacks.get(n)) == null ? void 0 : e.length) || 0;
    this._undoRedoStatus$.next({ undos: r, redos: s });
  }
  _getUndoStack(t, e = !1) {
    let n = this._undoStacks.get(t);
    return !n && e && (n = [], this._undoStacks.set(t, n)), n || null;
  }
  _getRedoStack(t, e = !1) {
    let n = this._redoStacks.get(t);
    return !n && e && (n = [], this._redoStacks.set(t, n)), n || null;
  }
  _getUndoStackForFocused() {
    let t = this._getFocusedUnitId();
    if (!t) throw Error("No focused univer instance!");
    return this._getUndoStack(t, !0);
  }
  _getRedoStackForFocused() {
    let t = this._getFocusedUnitId();
    if (!t) throw Error("No focused univer instance!");
    return this._getRedoStack(t, !0);
  }
  _tryBatchingElements(t, e) {
    t.redoMutations.push(...e.redoMutations), t.undoMutations.push(...e.undoMutations);
  }
  _getFocusedUnitId() {
    let t = "", e = this._contextService.getContextValue(Sr), n = this._contextService.getContextValue($E), r = this._contextService.getContextValue(jE);
    if (e) if (n) t = qc;
    else if (r) t = Zc;
    else {
      var s, i;
      t = (s = (i = this._univerInstanceService.getFocusedUnit()) == null ? void 0 : i.getUnitId()) == null ? "" : s;
    }
    else {
      var o, a;
      t = (o = (a = this._univerInstanceService.getFocusedUnit()) == null ? void 0 : a.getUnitId()) == null ? "" : o;
    }
    return t;
  }
};
po = Ue([Ut(0, jr), Ut(1, Js), Ut(2, Wr)], po);
var vv = class {
  constructor(t, e = 1e3) {
    this._injector = t, y(this, "_imageCacheMap", void 0), this._imageCacheMap = new Aa(e);
  }
  _getImageCacheKey(t, e) {
    return `${t}-${e}`;
  }
  getImage(t, e, n, r) {
    let s = this._getImageCacheKey(t, e);
    return this._imageCacheMap.get(s) || ((async () => {
      let i = new Image(), o = this._injector.has(du) ? this._injector.get(du) : null, a = this._injector.has(hu) ? this._injector.get(hu) : null;
      if (t === cu.UUID) try {
        i.src = await (o == null ? void 0 : o.getImage(e)) || "";
      } catch (l) {
        console.error(l);
      }
      else if (t === cu.URL) try {
        i.src = await (a == null ? void 0 : a.getImage(e)) || e;
      } catch {
        i.src = e;
      }
      else i.src = e;
      i.onload = () => {
        i.removeAttribute("data-error"), n == null || n();
      }, i.onerror = () => {
        i.setAttribute("data-error", "true"), r == null || r();
      }, this._imageCacheMap.set(s, i);
    })(), null);
  }
};
function pb(t) {
  return !(t.length === 0 || t.length > 31 || t.startsWith("'") || t.endsWith("'") || /[:\\\/\?\*\[\]]/.test(t));
}
function gb(t, e) {
  return !(!t || t.length === 0 || t.length > 255 || e.has(t) || /[ :\\\/\?\*\[\]]/.test(t) || !/^[\p{L}_]/u.test(t) || /^\$?[A-Za-z]{1,3}\$?[0-9]+$/.test(t) || /^[rR]\d+[cC]\d+$/.test(t) || /^\d+$/.test(t));
}
var mb = class {
  constructor(t = !1) {
    this._enableOneCellCache = t, y(this, "_tree", /* @__PURE__ */ new Map()), y(this, "_oneCellCache", /* @__PURE__ */ new Map()), y(this, "_kdTree", /* @__PURE__ */ new Map());
  }
  dispose() {
    this.clear();
  }
  getTree(t, e) {
    return this._tree.has(t) || this._tree.set(t, /* @__PURE__ */ new Map()), this._tree.get(t).has(e) || this._tree.get(t).set(e, new Hi()), this._tree.get(t).get(e);
  }
  _getOneCellCache(t, e, n, r) {
    return this._oneCellCache.has(t) || this._oneCellCache.set(t, /* @__PURE__ */ new Map()), this._oneCellCache.get(t).has(e) || this._oneCellCache.get(t).set(e, /* @__PURE__ */ new Map()), this._oneCellCache.get(t).get(e).has(n) || this._oneCellCache.get(t).get(e).set(n, /* @__PURE__ */ new Map()), this._oneCellCache.get(t).get(e).get(n).has(r) || this._oneCellCache.get(t).get(e).get(n).set(r, /* @__PURE__ */ new Set()), this._oneCellCache.get(t).get(e).get(n).get(r);
  }
  _removeOneCellCache(t, e, n, r, s) {
    let i = this._oneCellCache.get(t);
    if (!i) return;
    let o = i.get(e);
    if (!o) return;
    let a = o.get(n);
    if (!a) return;
    let l = a.get(r);
    l && l.delete(s);
  }
  _removeCellCacheByRange(t) {
    let { unitId: e, sheetId: n, range: r, id: s } = t, i = this._oneCellCache.get(e);
    if (!i) return;
    let o = i.get(n);
    if (!o) return;
    let { startRow: a, startColumn: l, endRow: u, endColumn: c } = r;
    for (let d = a; d <= u; d++) {
      let h = o.get(d);
      if (h) for (let f = l; f <= c; f++) {
        let p = h.get(f);
        p && p.delete(s);
      }
    }
  }
  _insertOneCellCache(t, e, n, r, s) {
    this._getOneCellCache(t, e, n, r).add(s);
  }
  _getRdTreeItems(t) {
    let e = [];
    for (let [n, r] of t) for (let [s, i] of r) e.push({ x: s, y: n, ids: i });
    return e;
  }
  _searchByOneCellCache(t) {
    var e;
    let { unitId: n, sheetId: r, range: s } = t, { startRow: i, startColumn: o, endRow: a, endColumn: l } = s, u = (e = this._kdTree.get(n)) == null ? void 0 : e.get(r);
    if (!u) return [];
    let { tree: c, items: d } = u, h = c.range(o, i, l, a), f = [];
    for (let p of h) {
      let g = d[p];
      f.push(...Array.from(g.ids));
    }
    return f;
  }
  openKdTree() {
    for (let [e, n] of this._oneCellCache) {
      this._kdTree.has(e) || this._kdTree.set(e, /* @__PURE__ */ new Map());
      for (let [r, s] of n) {
        var t;
        let i = this._getRdTreeItems(s), o = new Ca(i.length);
        (t = this._kdTree.get(e)) == null || t.set(r, { tree: o, items: i });
        for (let a of i) o.add(a.x, a.y);
        o.finish();
      }
    }
  }
  closeKdTree() {
    for (let [e, n] of this._oneCellCache) for (let [r, s] of n) {
      var t;
      (t = this._kdTree.get(e)) == null || t.set(r, void 0);
    }
  }
  insert(t) {
    let { unitId: e, sheetId: n, range: r, id: s } = t;
    if (!e || e.length === 0) return;
    let { startRow: i, endRow: o, startColumn: a, endColumn: l } = r;
    if (this._enableOneCellCache && i === o && a === l) {
      this._insertOneCellCache(e, n, i, a, s);
      return;
    }
    let u = this.getTree(e, n);
    Number.isNaN(i) && (i = 0), Number.isNaN(a) && (a = 0), Number.isNaN(o) && (o = 1 / 0), Number.isNaN(l) && (l = 1 / 0), u.insert({ minX: a, minY: i, maxX: l, maxY: o, id: s });
  }
  bulkInsert(t) {
    for (let e of t) this.insert(e);
  }
  *searchGenerator(t) {
    var e;
    let { unitId: n, sheetId: r, range: s } = t;
    if (this._enableOneCellCache) {
      let a = this._searchByOneCellCache(t);
      for (let l of a) yield l;
    }
    let i = (e = this._tree.get(n)) == null ? void 0 : e.get(r);
    if (!i) return;
    let o = i.search({ minX: s.startColumn, minY: s.startRow, maxX: s.endColumn, maxY: s.endRow });
    for (let a of o) yield a.id;
  }
  bulkSearch(t, e) {
    let n = /* @__PURE__ */ new Set();
    for (let r of t) for (let s of this.searchGenerator(r)) (e == null ? void 0 : e.has(s)) !== !0 && n.add(s);
    return n;
  }
  removeById(t, e) {
    if (e) {
      var n, r;
      (n = this._tree.get(t)) == null || n.delete(e), (r = this._oneCellCache.get(t)) == null || r.delete(e);
    } else this._tree.delete(t), this._oneCellCache.delete(t);
  }
  _removeRTreeItem(t) {
    let { unitId: e, sheetId: n, range: r, id: s } = t, i = this.getTree(e, n), o = i.search({ minX: r.startColumn, minY: r.startRow, maxX: r.endColumn, maxY: r.endRow });
    for (let a = 0; a < o.length; a++) o[a].id === s && i.remove(o[a]);
  }
  remove(t) {
    let { unitId: e, sheetId: n, range: r, id: s } = t, { startRow: i, startColumn: o, endRow: a, endColumn: l } = r;
    this._enableOneCellCache ? i === a && o === l ? this._removeOneCellCache(e, n, r.startRow, r.startColumn, s) : (this._removeCellCacheByRange(t), this._removeRTreeItem(t)) : this._removeRTreeItem(t);
  }
  bulkRemove(t) {
    for (let e of t) this.remove(e);
  }
  clear() {
    this._tree.clear(), this._oneCellCache.clear();
  }
  toJSON() {
    let t = {};
    return this._tree.forEach((e, n) => {
      t[n] = {}, e.forEach((r, s) => {
        t[n][s] = r.toJSON();
      });
    }), t;
  }
  fromJSON(t) {
    this._tree.clear();
    for (let e in t) {
      this._tree.set(e, /* @__PURE__ */ new Map());
      for (let n in t[e]) {
        let r = new Hi();
        r.fromJSON(t[e][n]), this._tree.get(e).set(n, r);
      }
    }
  }
};
function _b(t) {
  return new Promise((e) => setTimeout(e, t));
}
function yb(t = 1) {
  return new Promise((e) => {
    let n = 0, r = () => {
      n++, n >= t ? e() : requestAnimationFrame(r);
    };
    requestAnimationFrame(r);
  });
}
let go = class extends Qt {
  constructor(t) {
    super(), this._localeService = t, y(this, "_fontLocale", void 0), y(this, "_dirty", !0), this._localeInitial();
  }
  get dirty() {
    return this._dirty;
  }
  getFontLocale() {
    return this._fontLocale;
  }
  makeDirty(t) {
    this._dirty = t;
  }
  dispose() {
    super.dispose(), this._fontLocale = null;
  }
  _localeInitial() {
  }
};
go = Ue([Ut(0, Le(Qn))], go);
let Eu = class extends go {
  constructor(t, e, n, r, s, i) {
    super(n), this.worksheet = t, this._styles = e, this._contextService = r, this._configService = s, this._injector = i, y(this, "_worksheetData", void 0), y(this, "_renderRawFormula", !1), y(this, "_cellData", void 0), y(this, "_imageCacheMap", void 0), y(this, "_skipAutoHeightForMergedCells", !0), y(this, "_rowTotalHeight", 0), y(this, "_columnTotalWidth", 0), y(this, "_rowHeaderWidth", 0), y(this, "_columnHeaderHeight", 0), y(this, "_rowHeightAccumulation", []), y(this, "_columnWidthAccumulation", []), y(this, "_marginTop", 0), y(this, "_marginLeft", 0), y(this, "_scaleX", void 0), y(this, "_scaleY", void 0), y(this, "_scrollX", void 0), y(this, "_scrollY", void 0), this._worksheetData = this.worksheet.getConfig(), this._cellData = this.worksheet.getCellMatrix(), this._imageCacheMap = new vv(this._injector), this.initConfig();
  }
  initConfig() {
    var t, e;
    this._skipAutoHeightForMergedCells = !((t = this._configService.getConfig(i_)) != null && t), this.worksheet.setIsRowStylePrecedeColumnStyle((e = this._configService.getConfig("isRowStylePrecedeColumnStyle")) == null ? !1 : e);
  }
  resetCache() {
  }
  getWorksheetConfig() {
    return this._worksheetData;
  }
  getLocation() {
    return [this.worksheet.getUnitId(), this.worksheet.getSheetId()];
  }
  set columnHeaderHeight(t) {
    this._columnHeaderHeight = t, this._worksheetData.columnHeader.height = t;
  }
  set rowHeaderWidth(t) {
    this._rowHeaderWidth = t, this._worksheetData.rowHeader.width = t;
  }
  get rowHeightAccumulation() {
    return this._rowHeightAccumulation;
  }
  get rowTotalHeight() {
    return this._rowTotalHeight;
  }
  get columnWidthAccumulation() {
    return this._columnWidthAccumulation;
  }
  get columnTotalWidth() {
    return this._columnTotalWidth;
  }
  get rowHeaderWidth() {
    return this._rowHeaderWidth;
  }
  get columnHeaderHeight() {
    return this._columnHeaderHeight;
  }
  setMarginLeft(t) {
    this._marginLeft = t;
  }
  setMarginTop(t) {
    this._marginTop = t;
  }
  setScale(t, e) {
    this._updateLayout(), this._scaleX = t, this._scaleY = e || t, this._updateLayout();
  }
  setScroll(t, e) {
    j.isDefine(t) && (this._scrollX = t), j.isDefine(e) && (this._scrollY = e);
  }
  get scrollX() {
    return this._scrollX;
  }
  get scrollY() {
    return this._scrollY;
  }
  get scaleX() {
    return this._scaleX;
  }
  get scaleY() {
    return this._scaleY;
  }
  get rowHeaderWidthAndMarginLeft() {
    return this.rowHeaderWidth + this._marginLeft;
  }
  get columnHeaderHeightAndMarginTop() {
    return this.columnHeaderHeight + this._marginTop;
  }
  get imageCacheMap() {
    return this._imageCacheMap;
  }
  _generateRowMatrixCache(t, e, n) {
    let r = 0, s = [], i = e;
    for (let o = 0; o < t; o++) {
      let a = n;
      if (this.worksheet.getRowFiltered(o)) a = 0;
      else if (i[o] != null) {
        let l = i[o];
        if (!l) continue;
        let { h: u = n, ah: c, ia: d } = l;
        a = (d == null || d === z.TRUE) && typeof c == "number" && c > 0 ? c : u, l.hd === z.TRUE && (a = 0);
      }
      r += a, s.push(r);
    }
    return { rowTotalHeight: r, rowHeightAccumulation: s };
  }
  _generateColumnMatrixCache(t, e, n) {
    let r = 0, s = [], i = e;
    for (let o = 0; o < t; o++) {
      let a = n;
      if (i[o] != null) {
        let l = i[o];
        if (!l) continue;
        l.w != null && (a = l.w), l.hd === z.TRUE && (a = 0);
      }
      r += a, s.push(r);
    }
    return { columnTotalWidth: r, columnWidthAccumulation: s };
  }
  intersectMergeRange(t, e) {
    return !!this.worksheet.getMergedCell(t, e);
  }
  _getOverflowBound(t, e, n, r, s = sn.LEFT) {
    let i = 0;
    if (e > n) {
      let o = this._columnWidthAccumulation.length - 1;
      for (let a = e; a >= n; a--) {
        let l = a;
        if (!Xl(this.worksheet.getCell(t, l)) && l !== e || this.intersectMergeRange(t, l)) return l === e ? l : l + 1 > o ? o : l + 1;
        let { startX: u, endX: c } = _r(t, l, this.rowHeightAccumulation, this.columnWidthAccumulation);
        if (s === sn.CENTER && l === e ? i += (c - u) / 2 : i += c - u, r < i) return l;
      }
      return e;
    }
    for (let o = e; o <= n; o++) {
      let a = o;
      if (!Xl(this.worksheet.getCell(t, a)) && a !== e || this.intersectMergeRange(t, a)) return a === e ? a : a - 1 < 0 ? 0 : a - 1;
      let { startX: l, endX: u } = _r(t, a, this.rowHeightAccumulation, this.columnWidthAccumulation);
      if (s === sn.CENTER && a === e ? i += (u - l) / 2 : i += u - l, r < i) return a;
    }
    return n;
  }
  _updateLayout() {
    if (!this.dirty) return;
    let { rowData: t, columnData: e, defaultRowHeight: n, defaultColumnWidth: r, rowCount: s, columnCount: i, rowHeader: o, columnHeader: a } = this._worksheetData, { rowTotalHeight: l, rowHeightAccumulation: u } = this._generateRowMatrixCache(s, t, n), { columnTotalWidth: c, columnWidthAccumulation: d } = this._generateColumnMatrixCache(i, e, r);
    this._rowHeaderWidth = o.hidden === z.TRUE ? 0 : this._dynamicallyUpdateRowHeaderWidth(o), this._columnHeaderHeight = a.hidden === z.TRUE ? 0 : a.height, this._rowTotalHeight = l, this._rowHeightAccumulation = u, this._columnTotalWidth = c, this._columnWidthAccumulation = d, this.makeDirty(!1);
  }
  calculate() {
    return this.resetCache(), this._updateLayout(), this;
  }
  resetRangeCache(t) {
  }
  _dynamicallyUpdateRowHeaderWidth(t) {
    let e = `${this.worksheet.getRowCount()}`.length * 8;
    return Math.max(t.width, e);
  }
  _hasUnMergedCellInRow(t, e, n) {
    if (!this.worksheet.getMergeData()) return !1;
    for (let r = e; r <= n; r++) {
      let { isMerged: s, isMergedMainCell: i } = this.worksheet.getCellInfoInMergeData(t, r);
      if (!s && !i) return !0;
    }
    return !1;
  }
  expandRangeByMerge(t, e) {
    let { startRow: n, startColumn: r, endRow: s, endColumn: i } = t, o = this._worksheetData.mergeData;
    if (!o) return { startRow: n, startColumn: r, endRow: s, endColumn: i };
    let a = !0, l = new An(), u = 0, c = null;
    for (; a; ) {
      a = !1;
      for (let d = 0; d < o.length; d++) {
        let { startRow: h, startColumn: f, endRow: p, endColumn: g } = o[d];
        if (l.getValue(h, f)) continue;
        let _ = { startColumn: r, startRow: n, endColumn: i, endRow: s }, C = { startColumn: f, startRow: h, endColumn: g, endRow: p };
        by(_, C) && (n = Math.min(n, h), r = Math.min(r, f), s = Math.max(s, p), i = Math.max(i, g), l.setValue(h, f, !0), a = !0, u++, c = C);
      }
    }
    return e && u === 1 && je.contains(c, t) ? { startRow: c.startRow, startColumn: c.startColumn, endRow: c.startRow, endColumn: c.startColumn } : { startRow: n, startColumn: r, endRow: s, endColumn: i };
  }
  getColumnCount() {
    return this._columnWidthAccumulation.length;
  }
  getRowCount() {
    return this._rowHeightAccumulation.length;
  }
  _getCellMergeInfo(t, e) {
    return this.worksheet.getCellInfoInMergeData(t, e);
  }
  getNoMergeCellPositionByIndex(t, e, n = !0) {
    return this.getNoMergeCellWithCoordByIndex(t, e, n);
  }
  getNoMergeCellWithCoordByIndex(t, e, n = !0) {
    let { rowHeightAccumulation: r, columnWidthAccumulation: s, rowHeaderWidthAndMarginLeft: i, columnHeaderHeightAndMarginTop: o } = this, { startY: a, endY: l, startX: u, endX: c } = _r(t, e, r, s);
    return n && (a += o, l += o, u += i, c += i), { startY: a, endY: l, startX: u, endX: c };
  }
  getNoMergeCellPositionByIndexWithNoHeader(t, e) {
    let { rowHeightAccumulation: n, columnWidthAccumulation: r } = this, { startY: s, endY: i, startX: o, endX: a } = _r(t, e, n, r);
    return { startY: s, endY: i, startX: o, endX: a };
  }
  getRowIndexByOffsetY(t, e, n, r) {
    let { rowHeightAccumulation: s } = this;
    t = Rv(t, e, n, this.columnHeaderHeightAndMarginTop);
    let i = rs(s, t, r == null ? void 0 : r.firstMatch);
    if (r != null && r.closeFirst) {
      var o;
      Math.abs(s[i] - t) < Math.abs(t - ((o = s[i - 1]) == null ? 0 : o)) && (i += 1);
    }
    return i;
  }
  getColumnIndexByOffsetX(t, e, n, r) {
    let s = Cv(t, e, n, this.rowHeaderWidthAndMarginLeft), { columnWidthAccumulation: i } = this, o = rs(i, s, r == null ? void 0 : r.firstMatch);
    if (r != null && r.closeFirst) {
      var a;
      Math.abs(i[o] - s) < Math.abs(s - ((a = i[o - 1]) == null ? 0 : a)) && (o += 1);
    }
    return o;
  }
  getCellIndexByOffset(t, e, n, r, s, i) {
    return { row: this.getRowIndexByOffsetY(e, r, s, i), column: this.getColumnIndexByOffsetX(t, n, s, i) };
  }
  getCellByOffset(t, e, n, r, s) {
    var i;
    let o = (i = this) == null ? void 0 : i.getCellIndexByOffset(t, e, n, r, s, { firstMatch: !0 });
    return o ? this.worksheet.getCellInfoInMergeData(o.row, o.column) : null;
  }
  getCellWithCoordByIndex(t, e, n = !0) {
    var r;
    let { rowHeightAccumulation: s, columnWidthAccumulation: i, rowHeaderWidthAndMarginLeft: o, columnHeaderHeightAndMarginTop: a } = this, l = _r(t, e, s, i, (r = this.worksheet) == null ? void 0 : r.getCellInfoInMergeData(t, e)), { isMerged: u, isMergedMainCell: c } = l, { startY: d, endY: h, startX: f, endX: p, mergeInfo: g } = l, _ = o, C = a;
    return n === !1 && (_ = 0, C = 0), d += C, h += C, f += _, p += _, g.startY += C, g.endY += C, g.startX += _, g.endX += _, { actualRow: t, actualColumn: e, startX: f, startY: d, endX: p, endY: h, isMerged: u, isMergedMainCell: c, mergeInfo: g };
  }
  getCellWithCoordByOffset(t, e, n, r, s, i) {
    let { row: o, column: a } = this.getCellIndexByOffset(t, e, n, r, s, i);
    return this.getCellWithCoordByIndex(o, a);
  }
  getOffsetByColumn(t) {
    let { columnWidthAccumulation: e, rowHeaderWidthAndMarginLeft: n } = this, r = e.length - 1, s = e[t];
    return s == null ? t < 0 ? n : e[r] + n : s + n;
  }
  getOffsetByRow(t) {
    let { rowHeightAccumulation: e, columnHeaderHeightAndMarginTop: n } = this, r = e.length - 1, s = e[t];
    return s == null ? t < 0 ? n : e[r] + n : s + n;
  }
  getOffsetRelativeToRowCol(t, e) {
    let n = rs(this.columnWidthAccumulation, t), r = 0;
    r = n === 0 ? t : t - this._columnWidthAccumulation[n - 1];
    let s = rs(this.rowHeightAccumulation, e), i = 0;
    return i = s === 0 ? e : e - this._rowHeightAccumulation[s - 1], { row: s, column: n, columnOffset: r, rowOffset: i };
  }
  _updateConfigAndGetDocumentModel(t, e, n, r) {
    var s, i, o, a, l;
    if (!r || !((s = t.body) != null && s.dataStream)) return;
    t.documentStyle || (t.documentStyle = {}), t.documentStyle.marginTop = (i = n.t) == null ? 0 : i, t.documentStyle.marginBottom = (o = n.b) == null ? 2 : o, t.documentStyle.marginLeft = (a = n.l) == null ? 2 : a, t.documentStyle.marginRight = (l = n.r) == null ? 2 : l, t.documentStyle.pageSize = { width: 1 / 0, height: 1 / 0 }, t.documentStyle.renderConfig = { ...t.documentStyle.renderConfig, ...r };
    let u = t.body.paragraphs || [];
    for (let c of u) c.paragraphStyle || (c.paragraphStyle = {}), c.paragraphStyle.horizontalAlign = e;
    return new xn(t);
  }
  dispose() {
    super.dispose(), this._rowHeightAccumulation = [], this._columnWidthAccumulation = [], this._rowTotalHeight = 0, this._columnTotalWidth = 0, this._rowHeaderWidth = 0, this._columnHeaderHeight = 0, this._worksheetData = null, this._cellData = null, this._styles = null, this.worksheet = null;
  }
};
Eu = Ue([Ut(2, Le(Qn)), Ut(3, Wr), Ut(4, Qs), Ut(5, Le(Nn))], Eu);
function Gd(t, e, n, r) {
  let s = t - 1, i = e - 1, o = n[s] || 0, a = n[t];
  a == null && (a = n[n.length - 1]);
  let l = r[i] || 0, u = r[e];
  return u == null && (u = r[r.length - 1]), { startY: o, endY: a, startX: l, endX: u };
}
function Eb(t, e, n, r) {
  return Gd(t, e, n, r);
}
function _r(t, e, n, r, s) {
  t = j.clamp(t, 0, n.length - 1), e = j.clamp(e, 0, r.length - 1);
  let { startY: i, endY: o, startX: a, endX: l } = Gd(t, e, n, r);
  if (!s) return { startY: i, endY: o, startX: a, endX: l, isMerged: !1, isMergedMainCell: !1, actualRow: t, actualColumn: e, mergeInfo: { startY: i, endY: o, startX: a, endX: l, startRow: t, startColumn: e, endRow: t, endColumn: e } };
  let { isMerged: u, isMergedMainCell: c, startRow: d, startColumn: h, endRow: f, endColumn: p } = s, g = { startRow: d, startColumn: h, endRow: f, endColumn: p, startY: i, endY: o, startX: a, endX: l }, _ = n.length - 1, C = r.length - 1;
  if (u && d !== -1 && h !== -1) {
    let S = n[d - 1] || 0, T = n[f] || n[_], w = r[h - 1] || 0, E = r[p] || r[C];
    g = { ...g, startY: S, endY: T, startX: w, endX: E };
  } else if (!u && f !== -1 && p !== -1) {
    let S = n[f] || n[_], T = r[p] || r[C];
    g = { ...g, startY: i, endY: S, startX: a, endX: T };
  }
  return { isMerged: u, isMergedMainCell: c, actualRow: t, actualColumn: e, startY: i, endY: o, startX: a, endX: l, mergeInfo: g };
}
function Cv(t, e, n, r) {
  let { x: s } = n;
  return t / e + s - r;
}
function Rv(t, e, n, r) {
  let { y: s } = n;
  return t = t / e + s - r, t;
}
const vb = ["script", "style", "meta", "comment", "link"];
let Cb = function(t) {
  return t[t.INFO = 0] = "INFO", t[t.STOP = 1] = "STOP", t[t.WARNING = 2] = "WARNING", t;
}({}), Rb = function(t) {
  return t[t.DISABLED = 0] = "DISABLED", t[t.FULL_ALPHA = 1] = "FULL_ALPHA", t[t.FULL_HANGUL = 2] = "FULL_HANGUL", t[t.FULL_KATAKANA = 3] = "FULL_KATAKANA", t[t.HALF_ALPHA = 4] = "HALF_ALPHA", t[t.HALF_HANGUL = 5] = "HALF_HANGUL", t[t.HALF_KATAKANA = 6] = "HALF_KATAKANA", t[t.HIRAGANA = 7] = "HIRAGANA", t[t.NO_CONTROL = 8] = "NO_CONTROL", t[t.OFF = 9] = "OFF", t[t.ON = 10] = "ON", t;
}({}), bb = function(t) {
  return t.BETWEEN = "between", t.EQUAL = "equal", t.GREATER_THAN = "greaterThan", t.GREATER_THAN_OR_EQUAL = "greaterThanOrEqual", t.LESS_THAN = "lessThan", t.LESS_THAN_OR_EQUAL = "lessThanOrEqual", t.NOT_BETWEEN = "notBetween", t.NOT_EQUAL = "notEqual", t;
}({}), Ib = function(t) {
  return t[t.TEXT = 0] = "TEXT", t[t.ARROW = 1] = "ARROW", t[t.CUSTOM = 2] = "CUSTOM", t;
}({}), Tb = function(t) {
  return t.VALID = "valid", t.INVALID = "invalid", t.VALIDATING = "validating", t;
}({}), Sb = function(t) {
  return t.CUSTOM = "custom", t.LIST = "list", t.LIST_MULTIPLE = "listMultiple", t.NONE = "none", t.TEXT_LENGTH = "textLength", t.DATE = "date", t.TIME = "time", t.WHOLE = "whole", t.DECIMAL = "decimal", t.CHECKBOX = "checkbox", t.ANY = "any", t;
}({}), mo = class extends Qt {
  constructor(t, e) {
    super(), this._resourceManagerService = t, this._univerInstanceService = e, this._init();
  }
  _init() {
    let t = (e) => {
      e.businesses.forEach((n) => {
        switch (n) {
          case Et.UNRECOGNIZED:
          case Et.UNIVER_UNKNOWN:
          case Et.UNIVER_SLIDE:
          case Et.UNIVER_DOC:
            this._univerInstanceService.getAllUnitsForType(Et.UNIVER_DOC).forEach((r) => {
              let s = (r.getSnapshot().resources || []).find((i) => i.name === e.pluginName);
              if (s) try {
                let i = e.parseJson(s.data);
                e.onLoad(r.getUnitId(), i);
              } catch {
                console.error(`Load Document{${r.getUnitId()}} Resources{${e.pluginName}} Data Error.`);
              }
            });
            break;
          case Et.UNIVER_SHEET:
            this._univerInstanceService.getAllUnitsForType(Et.UNIVER_SHEET).forEach((r) => {
              let s = (r.getSnapshot().resources || []).find((i) => i.name === e.pluginName);
              if (s) try {
                let i = e.parseJson(s.data);
                e.onLoad(r.getUnitId(), i);
              } catch {
                console.error(`Load Workbook{${r.getUnitId()}} Resources{${e.pluginName}} Data Error.`);
              }
            });
        }
      });
    };
    this._resourceManagerService.getAllResourceHooks().forEach((e) => t(e)), this.disposeWithMe(this._resourceManagerService.register$.subscribe((e) => t(e))), this.disposeWithMe(this._univerInstanceService.getTypeOfUnitAdded$(Et.UNIVER_SHEET).subscribe((e) => {
      this._resourceManagerService.loadResources(e.getUnitId(), e.getSnapshot().resources);
    })), this.disposeWithMe(this._univerInstanceService.getTypeOfUnitAdded$(Et.UNIVER_DOC).subscribe((e) => {
      o_(e.getUnitId()) || this._resourceManagerService.loadResources(e.getUnitId(), e.getSnapshot().resources);
    })), this.disposeWithMe(this._univerInstanceService.getTypeOfUnitDisposed$(Et.UNIVER_SHEET).subscribe((e) => {
      this._resourceManagerService.unloadResources(e.getUnitId(), Et.UNIVER_SHEET);
    })), this.disposeWithMe(this._univerInstanceService.getTypeOfUnitDisposed$(Et.UNIVER_DOC).subscribe((e) => {
      this._resourceManagerService.unloadResources(e.getUnitId(), Et.UNIVER_DOC);
    }));
  }
  saveUnit(t) {
    let e = this._univerInstanceService.getUnit(t);
    if (!e) return null;
    let n = this._resourceManagerService.getResources(t, e.type), r = j.deepClone(e.getSnapshot());
    return r.resources = n, r;
  }
};
mo = Ue([Ut(0, Le(La)), Ut(1, Le(jr))], mo);
var wb = class {
  get _univerInstanceService() {
    return this._injector.get(jr);
  }
  get _pluginService() {
    return this._injector.get(Us);
  }
  constructor(t = {}, e) {
    y(this, "_startedTypes", /* @__PURE__ */ new Set()), y(this, "_injector", void 0), y(this, "_disposingCallbacks", new Ra());
    let n = this._injector = bv(e, t == null ? void 0 : t.override), { theme: r, darkMode: s, locale: i, locales: o, logLevel: a, logCommandExecution: l } = t;
    r && this._injector.get(fo).setTheme(r), s && this._injector.get(fo).setDarkMode(s), o && this._injector.get(Qn).load(o), i && this._injector.get(Qn).setLocale(i), a && this._injector.get(De).setLogLevel(a), l !== void 0 && this._injector.get(Qs).setConfig(F_, l), this._init(n);
  }
  __getInjector() {
    return this._injector;
  }
  onDispose(t) {
    let e = this._disposingCallbacks.add(Gt(t));
    return Gt(() => e.dispose(!0));
  }
  dispose() {
    this._disposingCallbacks.dispose(), this._injector.dispose();
  }
  setLocale(t) {
    this._injector.get(Qn).setLocale(t);
  }
  createUnit(t, e) {
    return this._univerInstanceService.createUnit(t, e);
  }
  createUniverSheet(t) {
    return this._injector.get(De).warn("[Univer]", "Univer.createUniverSheet is deprecated, use createUnit instead"), this._univerInstanceService.createUnit(Et.UNIVER_SHEET, t);
  }
  createUniverDoc(t) {
    return this._injector.get(De).warn("[Univer]", "Univer.createUniverDoc is deprecated, use createUnit instead"), this._univerInstanceService.createUnit(Et.UNIVER_DOC, t);
  }
  createUniverSlide(t) {
    return this._injector.get(De).warn("[Univer]", "Univer.createUniverSlide is deprecated, use createUnit instead"), this._univerInstanceService.createUnit(Et.UNIVER_SLIDE, t);
  }
  _init(t) {
    this._univerInstanceService.registerCtorForType(Et.UNIVER_SHEET, Fs), this._univerInstanceService.registerCtorForType(Et.UNIVER_DOC, xn), this._univerInstanceService.registerCtorForType(Et.UNIVER_SLIDE, Hd);
    let e = t.get(jr);
    e.__setCreateHandler((n, r, s, i) => {
      if (!this._startedTypes.has(n)) {
        this._pluginService.startPluginsForType(n), this._startedTypes.add(n);
        let a = t.createInstance(s, r);
        return e.__addUnit(a, i), this._tryProgressToReady(), a;
      }
      let o = t.createInstance(s, r);
      return e.__addUnit(o, i), o;
    });
  }
  _tryProgressToReady() {
    this._injector.get(tr).stage < Ot.Ready && (this._injector.get(tr).stage = Ot.Ready);
  }
  registerPlugin(t, e) {
    this._pluginService.registerPlugin(t, e);
  }
  registerPlugins(t) {
    t.forEach((e) => {
      let [n, r] = e;
      this._pluginService.registerPlugin(n, r);
    });
  }
};
function bv(t, e) {
  let n = pv([[WE], [Qn], [fo], [tr], [Us], [xs], [jr, { useClass: uo }], [hv, { useClass: fv }], [De, { useClass: L_, lazy: !0 }], [Js, { useClass: Vi }], [xa, { useClass: po, lazy: !0 }], [Qs, { useClass: D_ }], [Wr, { useClass: M_ }], [La, { useClass: ho, lazy: !0 }], [yu, { useClass: mo, lazy: !0 }], [HE, { useClass: ao }], [cv, { useClass: co, lazy: !0 }]], e), r = t ? t.createChild(n) : new Nn(n);
  return a_(r, [[xs], [yu]]), r;
}
t_();
export {
  Sn as $,
  ZC as A,
  $i as B,
  Mr as C,
  hC as D,
  qn as E,
  rR as F,
  d1 as G,
  IC as H,
  Jv as I,
  Od as J,
  L1 as K,
  jv as L,
  UR as M,
  u1 as N,
  fC as O,
  l1 as P,
  o1 as Q,
  c1 as R,
  yy as S,
  Yv as T,
  uR as U,
  cv as V,
  R1 as W,
  D_ as X,
  mr as Y,
  oe as Z,
  i_ as _,
  wt as a,
  jl as a$,
  pe as a0,
  xR as a1,
  FR as a2,
  eb as a3,
  tb as a4,
  ub as a5,
  lb as a6,
  ib as a7,
  sb as a8,
  sv as a9,
  Qt as aA,
  Ra as aB,
  NC as aC,
  xn as aD,
  O_ as aE,
  sR as aF,
  jE as aG,
  _1 as aH,
  WE as aI,
  kE as aJ,
  x1 as aK,
  $1 as aL,
  G1 as aM,
  ps as aN,
  k1 as aO,
  B1 as aP,
  j1 as aQ,
  $E as aR,
  W1 as aS,
  Y1 as aT,
  Sr as aU,
  gs as aV,
  fs as aW,
  H1 as aX,
  V1 as aY,
  z1 as aZ,
  DC as a_,
  q1 as aa,
  rb as ab,
  nb as ac,
  ab as ad,
  ob as ae,
  s_ as af,
  qc as ag,
  Zc as ah,
  r_ as ai,
  m1 as aj,
  MR as ak,
  jC as al,
  N1 as am,
  Ae as an,
  Cb as ao,
  Rb as ap,
  bb as aq,
  Ib as ar,
  Tb as as,
  Sb as at,
  _C as au,
  fb as av,
  L_ as aw,
  yC as ax,
  EC as ay,
  fn as az,
  cR as b,
  Wt as b$,
  ns as b0,
  $l as b1,
  LC as b2,
  sn as b3,
  Js as b4,
  Qs as b5,
  U1 as b6,
  Wr as b7,
  du as b8,
  hb as b9,
  Ta as bA,
  pn as bB,
  ql as bC,
  Zl as bD,
  CR as bE,
  uh as bF,
  ur as bG,
  co as bH,
  Hl as bI,
  f1 as bJ,
  p1 as bK,
  se as bL,
  P_ as bM,
  JC as bN,
  An as bO,
  XC as bP,
  QC as bQ,
  ch as bR,
  TC as bS,
  hR as bT,
  y1 as bU,
  nR as bV,
  ti as bW,
  g1 as bX,
  iR as bY,
  eR as bZ,
  A_ as b_,
  De as ba,
  hv as bb,
  yu as bc,
  La as bd,
  $v as be,
  hu as bf,
  jr as bg,
  vv as bh,
  cu as bi,
  K1 as bj,
  Le as bk,
  Nv as bl,
  Nn as bm,
  ts as bn,
  Xv as bo,
  CC as bp,
  Mv as bq,
  an as br,
  as as bs,
  Aa as bt,
  tr as bu,
  Ot as bv,
  uv as bw,
  nt as bx,
  po as by,
  Qn as bz,
  bC as c,
  bs as c$,
  PC as c0,
  PE as c1,
  Fd as c2,
  fv as c3,
  dv as c4,
  Yn as c5,
  Us as c6,
  BC as c7,
  ot as c8,
  RC as c9,
  fR as cA,
  xC as cB,
  ih as cC,
  Eu as cD,
  OC as cE,
  av as cF,
  go as cG,
  sh as cH,
  Xi as cI,
  Hd as cJ,
  HC as cK,
  SC as cL,
  YE as cM,
  aR as cN,
  dR as cO,
  ey as cP,
  $C as cQ,
  VC as cR,
  GC as cS,
  zC as cT,
  WC as cU,
  YC as cV,
  P1 as cW,
  AC as cX,
  ds as cY,
  Wi as cZ,
  UC as c_,
  Nt as ca,
  Oe as cb,
  w1 as cc,
  DR as cd,
  at as ce,
  Hi as cf,
  lC as cg,
  TR as ch,
  IR as ci,
  RR as cj,
  mb as ck,
  Ls as cl,
  je as cm,
  Fe as cn,
  Ev as co,
  mv as cp,
  C1 as cq,
  rC as cr,
  sC as cs,
  wC as ct,
  oR as cu,
  ho as cv,
  uu as cw,
  hs as cx,
  aC as cy,
  h1 as cz,
  MC as d,
  qr as d$,
  Ld as d0,
  Tt as d1,
  x as d2,
  we as d3,
  ad as d4,
  fo as d5,
  j as d6,
  yv as d7,
  _v as d8,
  ba as d9,
  ZE as dA,
  qE as dB,
  Z1 as dC,
  Me as dD,
  ev as dE,
  vR as dF,
  a1 as dG,
  ou as dH,
  d_ as dI,
  es as dJ,
  $R as dK,
  ly as dL,
  _R as dM,
  Ql as dN,
  ZR as dO,
  Qv as dP,
  oo as dQ,
  ms as dR,
  me as dS,
  Kv as dT,
  Wv as dU,
  dC as dV,
  ru as dW,
  gb as dX,
  Fv as dY,
  Uv as dZ,
  ud as d_,
  uo as da,
  Et as db,
  ft as dc,
  xs as dd,
  Nr as de,
  KC as df,
  Av as dg,
  Fs as dh,
  _u as di,
  Hr as dj,
  kC as dk,
  XE as dl,
  yR as dm,
  mR as dn,
  _b as dp,
  j_ as dq,
  ER as dr,
  gR as ds,
  JR as dt,
  tR as du,
  qR as dv,
  bR as dw,
  t1 as dx,
  e1 as dy,
  hy as dz,
  Dr as e,
  AR as e$,
  yb as e0,
  py as e1,
  lv as e2,
  Ov as e3,
  B_ as e4,
  F1 as e5,
  s1 as e6,
  ce as e7,
  Kp as e8,
  wn as e9,
  kv as eA,
  zR as eB,
  r1 as eC,
  Oa as eD,
  jR as eE,
  fy as eF,
  Zv as eG,
  qv as eH,
  Ba as eI,
  ri as eJ,
  SR as eK,
  Hv as eL,
  Xl as eM,
  ty as eN,
  Ua as eO,
  Vv as eP,
  Cu as eQ,
  kR as eR,
  gh as eS,
  uy as eT,
  Pa as eU,
  YR as eV,
  cy as eW,
  q_ as eX,
  o_ as eY,
  cC as eZ,
  QE as e_,
  Xe as ea,
  KR as eb,
  Gd as ec,
  LR as ed,
  Eb as ee,
  OR as ef,
  _r as eg,
  rn as eh,
  Vy as ei,
  Yy as ej,
  Gy as ek,
  XR as el,
  J1 as em,
  by as en,
  iy as eo,
  cb as ep,
  Wy as eq,
  Da as er,
  vC as es,
  O1 as et,
  $y as eu,
  Qi as ev,
  Cv as ew,
  Rv as ex,
  db as ey,
  xv as ez,
  z as f,
  vo as f$,
  E_ as f0,
  BR as f1,
  X1 as f2,
  n1 as f3,
  eC as f4,
  dy as f5,
  PR as f6,
  Q1 as f7,
  QR as f8,
  ka as f9,
  uC as fA,
  Pv as fB,
  rs as fC,
  H_ as fD,
  NR as fE,
  C_ as fF,
  v_ as fG,
  wa as fH,
  pR as fI,
  wv as fJ,
  l_ as fK,
  vb as fL,
  WR as fM,
  T1 as fN,
  S1 as fO,
  Zs as fP,
  zl as fQ,
  pd as fR,
  Wl as fS,
  Qc as fT,
  zv as fU,
  Gt as fV,
  a_ as fW,
  Jy as fX,
  Zy as fY,
  nC as fZ,
  mn as f_,
  wR as fa,
  Bv as fb,
  GR as fc,
  VR as fd,
  D1 as fe,
  HR as ff,
  So as fg,
  i1 as fh,
  pv as fi,
  oC as fj,
  iv as fk,
  tC as fl,
  Kl as fm,
  E1 as fn,
  pb as fo,
  A1 as fp,
  qs as fq,
  b1 as fr,
  I1 as fs,
  Lv as ft,
  v1 as fu,
  Gv as fv,
  Xs as fw,
  Oy as fx,
  M1 as fy,
  iC as fz,
  Ft as g,
  Dn as g0,
  er as g1,
  bf as g2,
  Vu as g3,
  Gp as g4,
  Yp as g5,
  Du as g6,
  _f as g7,
  Sv as g8,
  ne as g9,
  Os as gA,
  gn as gB,
  Mg as gC,
  Dv as gD,
  om as gE,
  cl as gF,
  ae as gG,
  de as gH,
  dm as gI,
  wg as gJ,
  gm as gK,
  fe as gL,
  pc as gM,
  gt as gN,
  d0 as gO,
  Di as gP,
  Qu as gQ,
  As as gR,
  f0 as gS,
  ya as gT,
  Ys as gU,
  gc as gV,
  h0 as gW,
  Kt as ga,
  ir as gb,
  xe as gc,
  $e as gd,
  dc as ge,
  Mn as gf,
  um as gg,
  zg as gh,
  zr as gi,
  hc as gj,
  im as gk,
  or as gl,
  ml as gm,
  fc as gn,
  _0 as go,
  mm as gp,
  _m as gq,
  sr as gr,
  Ag as gs,
  Ng as gt,
  lm as gu,
  $s as gv,
  Mo as gw,
  Jg as gx,
  Zu as gy,
  Xu as gz,
  HE as h,
  Sa as i,
  qC as j,
  wb as k,
  Vl as l,
  ao as m,
  lR as n,
  F_ as o,
  is as p,
  Xn as q,
  Gl as r,
  pC as s,
  xa as t,
  FC as u,
  Vi as v,
  on as w,
  gC as x,
  M_ as y,
  mC as z
};
