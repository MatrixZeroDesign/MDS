const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function routePath(pathname = location.pathname) {
	if (!basePath) return pathname;
	if (pathname === basePath || pathname === basePath + "/") return "/";
	return pathname.startsWith(basePath + "/") ? pathname.slice(basePath.length) : pathname;
}

export function appPath(path: string) {
	const normalized = path.startsWith("/") ? path : "/" + path;
	return basePath + normalized;
}

export function navigate(path: string) {
	const url = new URL(path, location.href);
	let pathname = routePath(url.pathname);
	if (pathname === "/docs/alert") pathname = "/docs/callout";
	const target = appPath(pathname);
	if (target === location.pathname && url.search === location.search) return;
	history.pushState(null, "", target + url.search);
	window.dispatchEvent(new PopStateEvent("popstate"));
}
function migrateHash() {
	if (routePath() === "/" && /^#[a-z][\w/-]*$/.test(location.hash)) {
		history.replaceState(null, "", appPath("/" + location.hash.slice(1)) + location.search);
		window.dispatchEvent(new PopStateEvent("popstate"));
	}
}
migrateHash();
if (routePath() === "/docs/alert")
	history.replaceState(null, "", appPath("/docs/callout") + location.search + location.hash);
window.addEventListener("hashchange", migrateHash);
document.addEventListener("click", (event) => {
	if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
		return;
	const link = (event.target as Element)?.closest<HTMLAnchorElement>("a[href]");
	if (!link || link.target || link.hasAttribute("download")) return;
	const url = new URL(link.href);
	if (url.origin !== location.origin || url.hash || /\.[a-z0-9]+$/i.test(url.pathname)) return;
	event.preventDefault();
	navigate(routePath(url.pathname) + url.search);
});
