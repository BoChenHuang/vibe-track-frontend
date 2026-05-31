import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx, jsxs } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useReducer, useState } from "react";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/.pnpm/@react-router+dev@7.16.0_@types+node@24.12.4_lightningcss@1.32.0_react-router@7.16.0_re_f9586864572a5e542427fb798c535035/node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), 6e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region app/store/reducer.ts
var initialState = {
	page: "analyze",
	inputMode: "text",
	textValue: "",
	imageFile: null,
	market: "TW",
	trackCount: 8,
	loading: false,
	result: null,
	error: null,
	history: [],
	rateTimes: [],
	usage: 0,
	maxUsage: 5,
	theme: "neon"
};
function appReducer(state, action) {
	switch (action.type) {
		case "setPage": return {
			...state,
			page: action.page
		};
		case "setMode": return {
			...state,
			inputMode: action.mode
		};
		case "setText": return {
			...state,
			textValue: action.value
		};
		case "setImage": return {
			...state,
			imageFile: action.file
		};
		case "setMarket": return {
			...state,
			market: action.value
		};
		case "setTrackCount": return {
			...state,
			trackCount: action.value
		};
		case "setTheme": return {
			...state,
			theme: action.theme
		};
		case "tickRate": return state;
		case "submit": return {
			...state,
			loading: true,
			error: null
		};
		case "submitResolved": return {
			...state,
			loading: false,
			result: action.result,
			history: [action.entry, ...state.history],
			usage: state.usage + 1
		};
		case "dismissError": return {
			...state,
			error: null
		};
		case "replayHistory": return {
			...state,
			page: "analyze",
			result: {
				mood: action.entry.mood,
				tracks: action.entry.tracks,
				market: action.entry.market,
				ts: action.entry.ts
			}
		};
		case "force429": return {
			...state,
			usage: state.maxUsage
		};
		default: return state;
	}
}
//#endregion
//#region app/store/AppContext.tsx
var AppContext = createContext(null);
function AppProvider({ children }) {
	const [state, dispatch] = useReducer(appReducer, initialState);
	return /* @__PURE__ */ jsx(AppContext.Provider, {
		value: {
			state,
			dispatch
		},
		children
	});
}
function useApp() {
	const ctx = useContext(AppContext);
	if (!ctx) throw new Error("useApp must be used within AppProvider");
	return ctx;
}
var Atmosphere_module_default = {
	atmosphere: "_atmosphere_4pwq6_1",
	orb: "_orb_4pwq6_9",
	orb1: "_orb1_4pwq6_16",
	drift1: "_drift1_4pwq6_1",
	orb2: "_orb2_4pwq6_25",
	drift2: "_drift2_4pwq6_1",
	orb3: "_orb3_4pwq6_34",
	drift3: "_drift3_4pwq6_1",
	grain: "_grain_4pwq6_43"
};
//#endregion
//#region app/components/layout/Atmosphere.tsx
function Atmosphere() {
	return /* @__PURE__ */ jsxs("div", {
		className: Atmosphere_module_default.atmosphere,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ jsx("div", { className: `${Atmosphere_module_default.orb} ${Atmosphere_module_default.orb1}` }),
			/* @__PURE__ */ jsx("div", { className: `${Atmosphere_module_default.orb} ${Atmosphere_module_default.orb2}` }),
			/* @__PURE__ */ jsx("div", { className: `${Atmosphere_module_default.orb} ${Atmosphere_module_default.orb3}` }),
			/* @__PURE__ */ jsx("div", {
				className: Atmosphere_module_default.grain,
				children: /* @__PURE__ */ jsxs("svg", {
					width: "100%",
					height: "100%",
					xmlns: "http://www.w3.org/2000/svg",
					children: [/* @__PURE__ */ jsxs("filter", {
						id: "grain-filter",
						children: [/* @__PURE__ */ jsx("feTurbulence", {
							type: "fractalNoise",
							baseFrequency: "0.65",
							numOctaves: "3",
							stitchTiles: "stitch"
						}), /* @__PURE__ */ jsx("feColorMatrix", {
							type: "saturate",
							values: "0"
						})]
					}), /* @__PURE__ */ jsx("rect", {
						width: "100%",
						height: "100%",
						filter: "url(#grain-filter)"
					})]
				})
			})
		]
	});
}
var UsagePill_module_default = {
	pill: "_pill_lpqhd_1",
	dot: "_dot_lpqhd_16",
	dotGreen: "_dotGreen_lpqhd_23",
	dotRed: "_dotRed_lpqhd_28"
};
//#endregion
//#region app/components/ui/UsagePill.tsx
function UsagePill() {
	const { state } = useApp();
	const remaining = state.maxUsage - state.usage;
	const exhausted = remaining <= 0;
	return /* @__PURE__ */ jsxs("div", {
		className: UsagePill_module_default.pill,
		children: [
			/* @__PURE__ */ jsx("span", { className: `${UsagePill_module_default.dot} ${exhausted ? UsagePill_module_default.dotRed : UsagePill_module_default.dotGreen}` }),
			Math.max(0, remaining),
			"/",
			state.maxUsage,
			" RATE / HR"
		]
	});
}
var Topbar_module_default = {
	topbar: "_topbar_1mkar_1",
	brand: "_brand_1mkar_15",
	nav: "_nav_1mkar_24",
	navLink: "_navLink_1mkar_34",
	navLinkActive: "_navLinkActive_1mkar_50",
	right: "_right_1mkar_55"
};
//#endregion
//#region app/components/layout/Topbar.tsx
function Topbar() {
	return /* @__PURE__ */ jsxs("header", {
		className: Topbar_module_default.topbar,
		children: [
			/* @__PURE__ */ jsx("span", {
				className: Topbar_module_default.brand,
				children: "VibeTrack"
			}),
			/* @__PURE__ */ jsxs("nav", {
				className: Topbar_module_default.nav,
				"aria-label": "Main navigation",
				children: [/* @__PURE__ */ jsx(NavLink, {
					to: "/",
					end: true,
					className: ({ isActive }) => `${Topbar_module_default.navLink}${isActive ? ` ${Topbar_module_default.navLinkActive}` : ""}`,
					children: "Analyze"
				}), /* @__PURE__ */ jsx(NavLink, {
					to: "/dashboard",
					className: ({ isActive }) => `${Topbar_module_default.navLink}${isActive ? ` ${Topbar_module_default.navLinkActive}` : ""}`,
					children: "Dashboard"
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: Topbar_module_default.right,
				children: /* @__PURE__ */ jsx(UsagePill, {})
			})
		]
	});
}
//#endregion
//#region app/lib/icons.tsx
function CloseIcon({ size = 16, className }) {
	return /* @__PURE__ */ jsxs("svg", {
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		className,
		children: [/* @__PURE__ */ jsx("line", {
			x1: "18",
			y1: "6",
			x2: "6",
			y2: "18"
		}), /* @__PURE__ */ jsx("line", {
			x1: "6",
			y1: "6",
			x2: "18",
			y2: "18"
		})]
	});
}
//#endregion
//#region app/lib/utils.ts
function formatCountdown(seconds) {
	if (seconds < 60) return `${seconds}s`;
	if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
	return `${Math.floor(seconds / 3600)}h ${Math.floor(seconds % 3600 / 60)}m`;
}
var RateLimitToast_module_default = {
	toast: "_toast_wfsl8_1",
	slideIn: "_slideIn_wfsl8_1",
	label: "_label_wfsl8_19",
	closeBtn: "_closeBtn_wfsl8_24"
};
//#endregion
//#region app/components/ui/RateLimitToast.tsx
function isRateLimitError(e) {
	return typeof e === "object" && e !== null && "error" in e && e.error === "rate_limited";
}
function RateLimitToast() {
	const { state, dispatch } = useApp();
	const { error } = state;
	const [remaining, setRemaining] = useState(0);
	useEffect(() => {
		if (!isRateLimitError(error)) return;
		setRemaining(error.retry_after);
		const id = setInterval(() => {
			setRemaining((prev) => {
				if (prev <= 1) {
					clearInterval(id);
					dispatch({ type: "dismissError" });
					return 0;
				}
				return prev - 1;
			});
		}, 1e3);
		return () => clearInterval(id);
	}, [error, dispatch]);
	if (!isRateLimitError(error)) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: RateLimitToast_module_default.toast,
		role: "alert",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: RateLimitToast_module_default.label,
				children: "速率限制"
			}),
			/* @__PURE__ */ jsxs("span", { children: ["請稍後再試 — ", formatCountdown(remaining)] }),
			/* @__PURE__ */ jsx("button", {
				className: RateLimitToast_module_default.closeBtn,
				onClick: () => dispatch({ type: "dismissError" }),
				"aria-label": "關閉",
				children: /* @__PURE__ */ jsx(CloseIcon, { size: 14 })
			})
		]
	});
}
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	Layout: () => Layout,
	default: () => root_default
});
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ jsx("link", {
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			children,
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
var root_default = UNSAFE_withComponentProps(function Root() {
	return /* @__PURE__ */ jsxs(AppProvider, { children: [
		/* @__PURE__ */ jsx(Atmosphere, {}),
		/* @__PURE__ */ jsx(Topbar, {}),
		/* @__PURE__ */ jsx(Outlet, {}),
		/* @__PURE__ */ jsx(RateLimitToast, {})
	] });
});
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary({ error }) {
	if (isRouteErrorResponse(error) && error.status === 404) return /* @__PURE__ */ jsx("div", { children: "404 — Page not found" });
	return /* @__PURE__ */ jsx("div", { children: "Something went wrong" });
});
//#endregion
//#region app/routes/_index.tsx
var _index_exports = /* @__PURE__ */ __exportAll({
	default: () => _index_default,
	meta: () => meta$1
});
var meta$1 = () => [{ title: "VibeTrack" }, {
	name: "description",
	content: "分析你的情緒，獲得 Spotify 歌曲推薦"
}];
var _index_default = UNSAFE_withComponentProps(function HomePage() {
	return /* @__PURE__ */ jsx("div", { children: "Analyze" });
});
//#endregion
//#region app/routes/dashboard.tsx
var dashboard_exports = /* @__PURE__ */ __exportAll({
	default: () => dashboard_default,
	meta: () => meta
});
var meta = () => [{ title: "Dashboard — VibeTrack" }];
var dashboard_default = UNSAFE_withComponentProps(function DashboardPage() {
	return /* @__PURE__ */ jsx("div", { children: "Dashboard" });
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-O7i1QjvI.js",
		"imports": ["/assets/jsx-runtime-Cc6DCyMV.js"],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/root-DQLZhR5A.js",
			"imports": ["/assets/jsx-runtime-Cc6DCyMV.js"],
			"css": ["/assets/root-DpnwfAm4.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/_index": {
			"id": "routes/_index",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/_index-CXnSvXkq.js",
			"imports": ["/assets/jsx-runtime-Cc6DCyMV.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/dashboard": {
			"id": "routes/dashboard",
			"parentId": "root",
			"path": "/dashboard",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/dashboard-NAuIaiB0.js",
			"imports": ["/assets/jsx-runtime-Cc6DCyMV.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-6dbed601.js",
	"version": "6dbed601",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build/client";
var basename = "/";
var future = {
	"unstable_optimizeDeps": false,
	"v8_passThroughRequests": false,
	"v8_trailingSlashAwareDataRequests": false,
	"unstable_previewServerPrerendering": false,
	"v8_middleware": false,
	"v8_splitRouteModules": false,
	"v8_viteEnvironmentApi": true
};
var ssr = true;
var isSpaMode = false;
var prerender = ["/"];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/_index": {
		id: "routes/_index",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: _index_exports
	},
	"routes/dashboard": {
		id: "routes/dashboard",
		parentId: "root",
		path: "/dashboard",
		index: void 0,
		caseSensitive: void 0,
		module: dashboard_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
