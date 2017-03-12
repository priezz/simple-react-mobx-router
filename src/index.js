import React from 'react'
import { action, observable, computed, useStrict, reaction } from 'mobx'

import { getDescendantProp, setDescendantProp, objectsEqual } from './routines'


useStrict(true)

export default class Router {
	_defaultRoute
	_defaultFallback
	_views = {}
	_history = []
	@observable _currentRoute = {}

	//getCurrentRoute = path => {
	currentRoute = path => computed(() => {
		// console.debug("Router/currentRoute()", path, this._currentRoute.path)
		const current = this._currentRoute.path
		if(!path) return current
		if(current.indexOf(path) === -1 ) return null
		return current.replace(path, "").split("/").filter(p => p)[0]
	//}
	})

	constructor(routesDefs = {}, {defaultRoute, defaultFallback} = {}) {
		// const self = this
		// console.debug("Router/constructor()")

		for(let path in routesDefs) {
			const options = routesDefs[path]
			let { component, props = {}, condition, fallback } = options || {}
			if(typeof options !== 'object') component = options
			if(!component || component === null) component = () => this.currentSubView(path).get()

			setDescendantProp(this._views, `/${path}`, {
				__component: component,
				__props: props,
				__condition: condition,
				__fallback: fallback
			}, "/")
		}
		this._setDefaultRoute(defaultRoute || Object.keys(routesDefs)[0] )
		this._defaultFallback = defaultFallback
		// console.log("Router/constructor()", this._views)
	}

	@action('ROUTE_SET') go(path, props) {
		if(this._currentRoute.path === path && objectsEqual(this._currentRoute.props, props) ) return
		// console.debug("Router/go()", path, props)
		if(!this._currentRoute.props || !this._currentRoute.props._doNotTrack) this._history.push(this._currentRoute)
		this._currentRoute = { path, props }
	}

	@action('ROUTE_SET-DEFAULT') _setDefaultRoute(path, props) {
		// console.log("ROUTE_SET-DEFAULT", path, props)
		if(!path) return
		this._defaultRoute = path
		this._currentRoute = { path, props }
	}

	@action('ROUTE_BACK') goBack(changeTop = false) {
		// console.debug("Router/back()", changeTop)
		const initialTop = this.currentRoute('/').get()
		if(this._history.length) do {
			this._currentRoute = this._history[this._history.length - 1]
			this._history.pop()
		} while(this._history.length && changeTop && this.currentRoute('/').get() === initialTop)
		return true
	}

	getView(path, props = {}, asComponent = false) {
		// TODO: Support parameterized paths: /some/:param/:other_param/path
		// console.log("getView()", path, props)
		if(!path) return null
		const obj = getDescendantProp(this._views, path, "/")
		// console.log("getView() obj", obj)
		if(!obj || !obj.__component) return null
		const condition = obj.__condition
		const check = typeof condition === 'function' ? condition() : true
		// console.log("getView() check", typeof condition, check)
		// console.log("getView() props", { ...obj.__props, ...props })
		return check
			? (asComponent
				? [obj.__component, { ...obj.__props, ...props }]
				: React.createElement(obj.__component, { ...obj.__props, ...props })
			  )
			: this.getView(obj.__fallback || this._defaultFallback, { _doNotTrack: true }, asComponent)
	}

	getSubViews(path) {
		// console.log("getSubViews:", path)
		const routeDef = getDescendantProp(this._views, path, "/")
		// console.log("getSubViews:", routeDef)
		// console.log("getSubViews: currentRoute", this._currentRoute)
		return Object.keys(routeDef)
			.filter(key => key.indexOf('__') !== 0) // check these are not service fields
			.map(key => this.getView(
				`${path}/${key}`,
				{ ...this._currentRoute.props, ...routeDef[key].__props, key }
			))
	}

	currentSubView = (path, props = {}, asComponent = false) => computed(() => {
		// console.debug("Router/currentSubView()", path, props, this._currentRoute.path)
		const key = this.currentRoute(path).get()
		// console.log("currentSubView() key", key)
		if(!key) return null
		return this.getView(`${path}/${key}`, { ...this._currentRoute.props, ...props }, asComponent)
	})
	// getCurrentViewByLevel =  (level = 1, props = {} ) => {
	// 	const pathParts = this._currentRoute.path.split("/").filter(p => p).splice(0, level)
	// 	if(pathParts.length < level) return null
	// 	const path = pathParts.join("/")
	// 	return this.getView(path, { ...this._currentRoute.props, ...props } )
	// }
}

