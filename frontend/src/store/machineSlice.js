import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/machines";

function getErrorMessage(error) {
  if (error.response && error.response.data && error.response.data.error) {
    return error.response.data.error; // message sent by our backend
  }
  return error.message;
}

// GET /api/machines
export const fetchMachines = createAsyncThunk(
  "machines/fetchMachines",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// PATCH /api/machines/:id/status
export const acknowledgeFault = createAsyncThunk(
  "machines/acknowledgeFault",
  async (machineId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${machineId}/status`, {
        status: "idle",
      });
      return response.data; // the updated machine
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  acknowledgingId: null,
  acknowledgeError: null,
};

const machineSlice = createSlice({
  name: "machines",
  initialState,
  reducers: {
    clearAcknowledgeError: (state) => {
      state.acknowledgeError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all machines
      .addCase(fetchMachines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load machines";
      })

      // Acknowledge fault
      .addCase(acknowledgeFault.pending, (state, action) => {
        state.acknowledgingId = action.meta.arg; // the machineId we passed in
        state.acknowledgeError = null;
      })
      .addCase(acknowledgeFault.fulfilled, (state, action) => {
        state.acknowledgingId = null;
        const updated = action.payload;
        const index = state.items.findIndex((m) => m.id === updated.id);
        if (index !== -1) {
          state.items[index] = updated;
        }
      })
      .addCase(acknowledgeFault.rejected, (state, action) => {
        state.acknowledgingId = null;
        state.acknowledgeError =
          action.payload || "Failed to acknowledge fault";
      });
  },
});

export const { clearAcknowledgeError } = machineSlice.actions;
export default machineSlice.reducer;
