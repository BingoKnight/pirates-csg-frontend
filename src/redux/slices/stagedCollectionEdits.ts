import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const stagedCollectionEditsSlice = createSlice({
    name: 'stagedCollectionEdits',
    initialState: {
        value: {
            adds: [],
            removes: []
        }
    },
    reducers: {
        setStagedCollectionAdds: (state: any, action: PayloadAction<string[]>) => { state.value.adds = action.payload },
        setStagedCollectionRemoves: (state: any, action: PayloadAction<string[]>) => { state.value.removes = action.payload }
    }
})

export const { setStagedCollectionAdds, setStagedCollectionRemoves } = stagedCollectionEditsSlice.actions

export default stagedCollectionEditsSlice.reducer

