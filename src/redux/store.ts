import { configureStore } from '@reduxjs/toolkit'
import stagedCollectionEditsReducer from './slices/stagedCollectionEdits.ts'

export default configureStore({
    reducer: {
        stagedCollectionEdits: stagedCollectionEditsReducer
    }
})
