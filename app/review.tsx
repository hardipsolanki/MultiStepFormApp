import StepHeader from "@/components/StepIndicator";
import { useRouter } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";
import { setStep } from "../features/formSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function Review() {
  const data = useAppSelector((s) => s.form);
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <StepHeader step={data.step} />

      <Text>Gender: {data.personal.gender}</Text>
      <Text>City: {data.address.city}</Text>
      <Text>Job: {data.professional.job}</Text>

      <Button
        title="Back"
        onPress={() => {
          dispatch(setStep(2));
          router.back();
        }}
      />

      <Button title="Submit" onPress={() => alert("Submitted")} />
    </View>
  );
}
