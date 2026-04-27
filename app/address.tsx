import StepHeader from "@/components/StepIndicator";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { saveAddress, setStep } from "../features/formSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function Address() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const step = useAppSelector((s) => s.form.step);

  const [city, setCity] = useState("");

  return (
    <View style={{ padding: 20 }}>
      <StepHeader step={step} />
      <TextInput placeholder="City" onChangeText={setCity} />

      <Button
        title="Back"
        onPress={() => {
          dispatch(setStep(0));
          router.back();
        }}
      />

      <Button
        title="Next"
        onPress={() => {
          dispatch(saveAddress({ city }));
          dispatch(setStep(2));
          router.push("/professional");
        }}
      />
    </View>
  );
}
