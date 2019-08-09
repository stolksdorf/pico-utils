const useLocalStorage = (key, init)=>{
	const [val, setVal] = React.useState(init);
	React.useEffect(()=>{
		try {setVal(JSON.parse(window.localStorage.getItem(key)));} catch (err){}
	}, []);
	return [val, (newVal)=>{
		window.localStorage.setItem(key, JSON.stringify(newVal));
		setVal(newVal);
	}];
};


const useForceUpdate = ()=>{
  const [value, set] = React.useState(true);
  return ()=>set(!value);
};

const isMounted = ()=>{
	const mounted = React.useRef(false);
	React.useEffect(()=>{
		mounted.current = true;
		return ()=>mounted.currnet = false;
	});
	return mounted.current;
};
