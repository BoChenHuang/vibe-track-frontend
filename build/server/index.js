import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx, jsxs } from "react/jsx-runtime";
import { createContext, useReducer } from "react";
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
	return /* @__PURE__ */ jsx(AppProvider, { children: /* @__PURE__ */ jsx(Outlet, {}) });
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
		"module": "/assets/entry.client-D0_5fq24.js",
		"imports": ["/assets/jsx-runtime-BrOl_4xq.js"],
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
			"module": "/assets/root-CYdyY29r.js",
			"imports": ["/assets/jsx-runtime-BrOl_4xq.js"],
			"css": ["/assets/root-BmG3vUdv.css"],
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
			"module": "/assets/_index-B_UQ2Ohx.js",
			"imports": ["/assets/jsx-runtime-BrOl_4xq.js"],
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
			"module": "/assets/dashboard-QTtVs5da.js",
			"imports": ["/assets/jsx-runtime-BrOl_4xq.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-3b6f36c5.js",
	"version": "3b6f36c5",
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
