import StepHeader from "@/components/StepIndicator";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { saveProfessional, setStep } from "../features/formSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function Professional() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const step = useAppSelector((s) => s.form.step);

  const [jobTitle, setJobTitle] = useState("");

  return (
    <View style={{ padding: 20 }}>
      <StepHeader step={step} />
      <TextInput placeholder="Job Title" onChangeText={setJobTitle} />

      <Button
        title="Back"
        onPress={() => {
          dispatch(setStep(1));
          router.back();
        }}
      />

      <Button
        title="Next"
        onPress={() => {
          dispatch(saveProfessional({ jobTitle }));
          dispatch(setStep(3));
          router.push("/address");
        }}
      />
    </View>
  );
}
