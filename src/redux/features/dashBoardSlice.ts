import { createSlice, createAsyncThunk, current, type PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

// https://knowing-owner-ff2.notion.site/555cdc7bcd274c47a2d9fb9e84a84db7

type CounterState = {
    value: number;
    openMenu: boolean;
    status: string;
    items: any[];
};

const initialState = {
    value: 0,
    openMenu: false,
    status: 'idle',
    items: [],
} as CounterState;
const ID: number = 62420;

type TEntry = {
    rowName: string,
    id: string,
    salary: string,
    machineOperatorSalary: string,
    estimatedProfit: string,
    child?: [] | any,
}

function Entry(entry: TEntry, id: number, payload: any) {
    return (
        entry?.child?.map((entry: TEntry, index: number) => {
            if (Number(id) === Number(entry.id)) {
                return entry.child?.push({ child: [], ...payload })
            }
            if (entry.child) {
                return Entry(entry, id, payload)
            }
        })
    )
}

function filterEntry(entry: any, id: number, payload: any) {
    let newEntry = entry?.child?.filter((entry: TEntry, index: number) => {
        if (Number(id) !== Number(entry.id)) {
            return true
        }
    })
    entry.child.map((entry: TEntry, index: number) => {
        if (entry.child.length > 0) {
            return filterEntry(entry, id, payload)
        }
    })
    entry.child = []
    entry.child.push(...newEntry)
}
function changeEntry(entry: any, id: number, payload: any) {
    let newEntry = entry?.child?.filter((entry: TEntry, index: number) => {
        if (Number(id) !== Number(entry.id)) {
            return true
        }
    })
    entry.child.map((entry: TEntry, index: number) => {
        if (entry.child.length > 0) {
            return filterEntry(entry, id, payload)

        }
    })
    entry.child = newEntry
    entry.child.map((entry: TEntry, index: number) => {
        return entry.child.push({ ...payload, child: [] })
    })
}

export const deleteItem = createAsyncThunk("delete/product", async (itemID: any, thunkApi) => {

    try {
        const response = await axios.delete(`http://185.244.172.108:8081/v1/outlay-rows/entity/${ID}/row/${itemID}/delete`)
        if (response.data) {

            return { ...response.data, parentId: itemID };
        }
    } catch (error) {
        return thunkApi.rejectWithValue(`error with createAsyncThunk ) ${error} `)
    }
});

export const changeItem = createAsyncThunk("change/product", async (newItem: any, thunkApi) => {

    try {

        const response = await axios.post(`http://185.244.172.108:8081/v1/outlay-rows/entity/${ID}/row/${newItem.id}/update`,
            newItem.item, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.data) {
            return { ...response.data, parentId: newItem.id };
        }
    } catch (error) {

        return thunkApi.rejectWithValue(`error with createAsyncThunk ) ${error} `)
    }
});



export const getAllItems = createAsyncThunk("get/product", async () => {

    try {
        const response = await axios.get(`http://185.244.172.108:8081/v1/outlay-rows/entity/${ID}/row/list`)
        if (response.data) {
            return response.data;
        }
    } catch (error) {
        // return thunkApi.rejectWithValue(`error with createAsyncThunk ) ${error} `)
    }
});
export const setNewItem = createAsyncThunk("set/product", async (newItem: any, thunkApi) => {
    try {
        const response = await axios.post(`http://185.244.172.108:8081/v1/outlay-rows/entity/${ID}/row/create`,
            newItem, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.data) {
            return { ...response.data, parentId: newItem.parentId };
        }
    } catch (error) {
        return thunkApi.rejectWithValue(`error with createAsyncThunk ) ${error} `)
    }
});

export const dashBoard = createSlice({
    name: "items",
    initialState,
    reducers: {
        reset: () => initialState,
        setOpenMenu: (state) => {
            state.openMenu = !state.openMenu;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(changeItem.pending, (state, action) => {
            state.status = 'loading'
        })
        builder.addCase(changeItem.fulfilled, (state, { payload }) => {
            state.status = 'idle'
            const sortedArr = state.items.filter((item: TEntry, index: number) => {
                if (item.child.length > 0 && item.id !== payload.parentId) {
                    let arr = changeEntry(item, payload.parentId, payload.current)
                    return true
                } else {
                    if (item.id !== payload.parentId) {
                        return true
                    }
                }
            })
            let currentItems = state.items
            // state.items = [...currentItems, { ...payload.current, child: [] }, ...sortedArr] //////////// fix
            if (sortedArr.length > 0) {
                // state.items = [...sortedArr, { ...payload.current, child: [] }] //////////// fix
                state.items = sortedArr
            } else {
                currentItems.map((item: TEntry) => {
                    state.items = [...sortedArr, { ...payload.current, child: [...item.child] }] //////////// fix
                })
            }
        })

        builder.addCase(deleteItem.pending, (state, action) => {
            state.status = 'loading'
        })
        builder.addCase(deleteItem.fulfilled, (state, { payload }) => {
            state.status = 'idle'
            const sortedArr = state.items.filter((item: TEntry, index: number) => {
                if (item.child.length > 0 && item.id !== payload.parentId) {
                    filterEntry(item, payload.parentId, payload.current)
                    return true
                } else {

                    if (item.id !== payload.parentId) {
                        return true
                    }
                }
            })
            state.items = sortedArr

        })

        builder.addCase(getAllItems.pending, (state, action) => {
            state.status = 'loading'
        })
        builder.addCase(getAllItems.fulfilled, (state, { payload }) => {
            state.status = 'idle'
            state.items = payload
        })
        builder.addCase(setNewItem.pending, (state, action) => {
            state.status = 'loading'
        })
        builder.addCase(setNewItem.fulfilled, (state, { payload }) => {
            state.status = 'idle'
            if (payload.parentId !== null) {
                state.items.map((item: TEntry, index: number) => {
                    if (item.child.length > 0 && item.id !== payload.parentId) {
                        Entry(item, payload.parentId, payload.current)
                    } else {
                        if (item.id === payload.parentId) {
                            state.items[index].child.push({ child: [], ...payload.current })
                        }
                    }
                })

            } else {
                state.items = [{ child: [], ...payload.current }]
            }
        })
    }

});

export const {
    reset,
    setOpenMenu,
} = dashBoard.actions;
export default dashBoard.reducer;
