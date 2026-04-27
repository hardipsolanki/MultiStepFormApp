import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 0,

  personal: {
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

export const {
  setStep,
  savePersonal,
  saveAddress,
  saveProfessional,
  resetForm,
} = formSlice.actions;

export default formSlice.reducer;