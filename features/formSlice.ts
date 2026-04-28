import { createSlice } from "@reduxjs/toolkit";



// ── Initial state ───────────────────────────────────────────────
const initialState = {
  step: 0,

  personal: {
    profileImage: "",
    gender: "",
    dob: { dd: "", mm: "", yy: "" },
    nationality: "",
    height: "",
  },

  address: {
    city: "",
    state: "",
    zip: "",
  },

  professional: {
    job: "",
    company: "",
    exp: "",
  },
};

// ── Slice ────────────────────────────────────────────────────────
const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    savePersonal: (state, action) => {
      state.personal = action.payload;
    },
    saveAddress: (state, action) => {
      state.address = action.payload;
    },
    saveProfessional: (state, action) => {
      state.professional = action.payload;
    },
    resetForm: () => initialState,
  },
});

export const { setStep, savePersonal, saveAddress, saveProfessional, resetForm } =
  formSlice.actions;

// ── Export persisted reducer ─────────────────────────────────────
export default formSlice.reducer