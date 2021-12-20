import protectedRoutes from '$constants/protectedRoutes';

const pathIsProtected = (path: string) => {
	if (path === '/') return false;
	return !!protectedRoutes.find((route) => {
		return route.includes(path);
	});
};

export default pathIsProtected;
