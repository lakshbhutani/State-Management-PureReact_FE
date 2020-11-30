import React, { useReducer, createContext, useCallback } from 'react';

import initialState from './initialState';
import id from 'uuid/v4';

const GRUDGE_FORGIVE = 'GRUDGE_FORGIVE';
const GRUDGE_ADD = 'GRUDGE_ADD';

export const GrudgeContext = createContext();

const reducer = (state, action) => {
    if (action.type === GRUDGE_ADD) {
        return [action.payload, ...state]
    }
    if (action.type === GRUDGE_FORGIVE) {
        return state.map(item => {
            if (item.id !== action.payload.id) return item;
            return { ...item, forgiven: !item.forgiven }
        })
    }
    return state;
}

export const GrudgeProvider = ({ children }) => {
    const [grudges, dispatch] = useReducer(reducer, initialState);

    const addGrudge = useCallback(({ person, reason }) => {
        dispatch({
            type: GRUDGE_ADD,
            payload: {
                person,
                reason,
                forgiven: false,
                id: id()
            }
        })
    }, [dispatch]);

    const toggleForgiveness = useCallback(id => {
        dispatch({
            type: GRUDGE_FORGIVE,
            payload: {
                id
            }
        })
    }, [dispatch]);

    const value = { grudges, addGrudge, toggleForgiveness };

    return (
        <GrudgeContext.Provider value={value}>
            {children}
        </GrudgeContext.Provider>
    )
}

