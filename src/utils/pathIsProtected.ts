import protectedRoutes from '$constants/protectedRoutes';

const pathIsProtected = (path: string) => {
	return !!protectedRoutes.find((route) => {
		return route.includes(path);
	});
};

export default pathIsProtected;
