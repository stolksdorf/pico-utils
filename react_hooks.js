/* --- xo Flavor --- */


const hasHistorySupport = !!(typeof window !== 'undefined' && window.history && window.history.pushState);
const isRegularClick    = (event)=>event.button === 0 && !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
const UseRouter = (scope, initialRoute)=>{
	const [currRoute, setCurrRoute] = scope.useState(initialRoute);
	scope.useEffect(()=>{
		if(!hasHistorySupport) return;
		window.addEventListener('popstate', ()=>setCurrRoute(window.location.pathname));
	},[]);
	const navigate = (route)=>{
		if(!hasHistorySupport) return window.location.pathname = route;
		window.history.pushState({}, null, route);
		setCurrRoute(route);
	};
	const hyperlink = (route)=>{
		return (evt)=>{
			if(!isRegularClick(evt)) return;
			navigate(route);
			evt.preventDefault();
		};
	};
	return [currRoute, navigate, hyperlink];
};


const useLocalState = (scope, key, init)=>{
	const [val, setVal] = scope.useState(init);
	scope.useEffect(()=>{
		try { setVal(JSON.parse(window.localStorage.getItem(key))); } catch (err){}
	}, []);
	return [val, (newVal)=>{
		try{ window.localStorage.setItem(key, JSON.stringify(newVal)); } catch (err){}
		setVal(newVal);
	}];
};

const useLocalState = (scope, key, init)=>{
	const [val, setVal] = scope.useState(()=>{
		try{ return JSON.parse(window.localStorage.getItem(key)) ?? init;
		}catch(err){ return init; }
	});
	return [val, (newVal)=>{
		try{ window.localStorage.setItem(key, JSON.stringify(newVal)); } catch (err){}
		setVal(newVal);
	}];
};




/* --- React Flavor --- */

const useLocalState = (init, key)=>{
	if(!key) throw `Must set a 'key' for local state hook`;
	const [val, setVal] = React.useState(init);
	React.useEffect(()=>{
		try { setVal(JSON.parse(window.localStorage.getItem(key))); } catch (err){}
	}, []);
	return [val, (newVal)=>{
		try{ window.localStorage.setItem(key, JSON.stringify(newVal)); } catch (err){}
		setVal(newVal);
	}];
};

const isMounted = (mountFn=()=>{})=>{
	const mounted = React.useRef(false);
	React.useEffect(()=>{
		mounted.current = true;
		mountFn();
	}, []);
	return mounted.current;
};

const useAsync = (asyncFn)=>{
	const [result, setResult] = React.useState();
	const [status, setStatus] = React.useState({ pending : false, errors : null });
	const execute = async (...args)=>{
		setStatus({ pending : true, errors : null });
		return asyncFn(...args)
			.then((res)=>{
				setStatus({ pending : false, errors : null });
				setResult(res);
			})
			.catch((err)=>{
				setStatus({ pending : false, errors : err });
			});
	}
	return [ execute, result, status ];
};

const useForceUpdate = ()=>{
	const [value, set] = React.useState(true);
	return ()=>set(!value);
};
