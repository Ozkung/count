export default defineNuxtRouteMiddleware((to, from) => {
    const { status } = useAuth();

    // Protect all URLs under /admin/* (but allow the login page /admin)
    if (to.path.startsWith('/admin/') && status.value === 'unauthenticated') {
        return navigateTo('/admin');
    }

    // Optional UX improvement: If authenticated and trying to access the login page, redirect to dashboard
    if (to.path === '/admin' && status.value === 'authenticated') {
        return navigateTo('/admin/events');
    }
});
