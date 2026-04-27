import StepHeader from "@/components/StepIndicator";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  resetForm,
  saveAddress,
  savePersonal,
  saveProfessional,
  setStep,
} from "../features/formSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function MultiStepForm() {
  const dispatch = useAppDispatch();
  const { step, personal, address, professional } = useAppSelector(
    (s) => s.form,
  );

  const [form, setForm] = useState({
    gender: "",
    dob: { dd: "", mm: "", yy: "" },
    nationality: "",
    height: "",
  });

  const [addr, setAddr] = useState({
    city: "",
    state: "",
    zip: "",
  });

  const [prof, setProf] = useState({
    job: "",
    company: "",
    exp: "",
  });

  const [showGender, setShowGender] = useState(false);

  // ---------------- VALIDATION ----------------
  const validateDOB = () => {
    const { dd, mm, yy } = form.dob;
    if (!dd || !mm || !yy) return false;
    const day = Number(dd);
    const month = Number(mm);
    const year = Number(yy);
    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    return true;
  };

  // ---------------- NAVIGATION ----------------
  const next = () => {
    if (step === 0) {
      if (!form.gender || !validateDOB()) {
        Alert.alert("Error", "Please fill valid Personal details");
        return;
      }
      dispatch(savePersonal(form));
      dispatch(setStep(1));
    } else if (step === 1) {
      dispatch(saveAddress(addr));
      dispatch(setStep(2));
      // setAddr({ city: "", state: "", zip: "" });
    } else if (step === 2) {
      dispatch(saveProfessional(prof));
      dispatch(setStep(3));
      // setProf({ job: "", company: "", exp: "" });
    } else {
      Alert.alert("Success", "Form Submitted");
      dispatch(resetForm());
      setForm({
        gender: "",
        dob: { dd: "", mm: "", yy: "" },
        nationality: "",
        height: "",
      });
    }
  };

  const back = () => {
    if (step > 0) dispatch(setStep(step - 1));
  };

  // ---------------- UI ----------------
  return (
    // ✅ FIX: KeyboardAvoidingView now wraps the ENTIRE screen
    // This ensures ALL inputs (including Height at the bottom) push up above the keyboard
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <Text style={styles.title}>You are almost done!</Text>
        <Text style={styles.subtitle}>
          Continue below details to complete your profile
        </Text>

        <Text style={styles.stepText}>Step {step + 1}</Text>
        <StepHeader step={step} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* ───── STEP 1 — Personal Info ───── */}
          {step === 0 && (
            <>
              <View style={styles.uploadRow}>
                <View style={styles.avatar} />
                <View>
                  <Text style={styles.label}>Upload your photo</Text>
                  <Text style={styles.subText}>
                    Kindly upload your professional photo
                  </Text>
                </View>
              </View>

              {/* Gender */}
              <Text style={styles.label}>Gender</Text>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={() => setShowGender(true)}
              >
                <Text style={{ color: form.gender ? "#000" : "#aaa" }}>
                  {form.gender || "Select Gender"}
                </Text>
                <Ionicons name="chevron-down" size={18} />
              </TouchableOpacity>

              <Modal visible={showGender} transparent>
                <TouchableOpacity
                  style={styles.modalBg}
                  onPress={() => setShowGender(false)}
                >
                  <View style={styles.dropdown}>
                    {["Male", "Female"].map((g) => (
                      <TouchableOpacity
                        key={g}
                        onPress={() => {
                          setForm({ ...form, gender: g });
                          setShowGender(false);
                        }}
                      >
                        <Text style={styles.dropdownItem}>{g}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </TouchableOpacity>
              </Modal>

              {/* DOB */}
              <Text style={styles.label}>Date of Birth</Text>
              <View style={styles.dobRow}>
                {(["dd", "mm", "yy"] as const).map((key) => (
                  <TextInput
                    key={key}
                    placeholder={key.toUpperCase()}
                    style={styles.dobBox}
                    value={form.dob[key]}
                    onChangeText={(text) =>
                      setForm({ ...form, dob: { ...form.dob, [key]: text } })
                    }
                    keyboardType="numeric"
                    maxLength={key === "yy" ? 4 : 2}
                  />
                ))}
              </View>

              {/* Nationality */}
              <Text style={styles.label}>Nationality</Text>
              <TextInput
                placeholder="Enter your nationality"
                style={styles.inputField}
                value={form.nationality}
                onChangeText={(t) => setForm({ ...form, nationality: t })}
              />

              {/* Height — was getting hidden behind keyboard */}
              <Text style={styles.label}>Height</Text>
              <TextInput
                placeholder="Enter your height (e.g. 175 cm)"
                style={styles.inputField}
                value={form.height}
                onChangeText={(t) => setForm({ ...form, height: t })}
                keyboardType="numeric"
                returnKeyType="done"
              />
            </>
          )}

          {/* ───── STEP 2 — Address ───── */}
          {step === 1 && (
            <>
              <Text style={styles.sectionTitle}>Address Information</Text>

              <Text style={styles.label}>City</Text>
              <TextInput
                placeholder="Enter your city"
                style={styles.inputField}
                value={addr.city}
                onChangeText={(t) => setAddr({ ...addr, city: t })}
                returnKeyType="next"
              />

              <Text style={styles.label}>State</Text>
              <TextInput
                placeholder="Enter your state"
                style={styles.inputField}
                value={addr.state}
                onChangeText={(t) => setAddr({ ...addr, state: t })}
                returnKeyType="next"
              />

              <Text style={styles.label}>ZIP / Postal Code</Text>
              <TextInput
                placeholder="Enter your ZIP code"
                style={styles.inputField}
                value={addr.zip}
                onChangeText={(t) => setAddr({ ...addr, zip: t })}
                keyboardType="numeric"
                returnKeyType="done"
              />
            </>
          )}

          {/* ───── STEP 3 — Professional ───── */}
          {step === 2 && (
            <>
              <Text style={styles.sectionTitle}>Professional Information</Text>

              <Text style={styles.label}>Job Title</Text>
              <TextInput
                placeholder="e.g. Software Engineer"
                style={styles.inputField}
                value={prof.job}
                onChangeText={(t) => setProf({ ...prof, job: t })}
                returnKeyType="next"
              />

              <Text style={styles.label}>Company Name</Text>
              <TextInput
                placeholder="e.g. Google, Infosys"
                style={styles.inputField}
                value={prof.company}
                onChangeText={(t) => setProf({ ...prof, company: t })}
                returnKeyType="next"
              />

              <Text style={styles.label}>Years of Experience</Text>
              <TextInput
                placeholder="e.g. 3 years"
                style={styles.inputField}
                value={prof.exp}
                onChangeText={(t) => setProf({ ...prof, exp: t })}
                keyboardType="numeric"
                returnKeyType="done"
              />
            </>
          )}

          {/* ───── STEP 4 — Review ───── */}
          {step === 3 && (
            <View style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>Review Details</Text>

              <Text style={styles.reviewSection}>Personal</Text>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewKey}>Gender</Text>
                <Text style={styles.reviewValue}>{personal.gender}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewKey}>Date of Birth</Text>
                <Text style={styles.reviewValue}>
                  {personal.dob?.dd}/{personal.dob?.mm}/{personal.dob?.yy}
                </Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewKey}>Nationality</Text>
                <Text style={styles.reviewValue}>{personal.nationality}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewKey}>Height</Text>
                <Text style={styles.reviewValue}>{personal.height}</Text>
              </View>

              <Text style={[styles.reviewSection, { marginTop: 12 }]}>
                Address
              </Text>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewKey}>City</Text>
                <Text style={styles.reviewValue}>{address.city}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewKey}>State</Text>
                <Text style={styles.reviewValue}>{address.state}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewKey}>ZIP</Text>
                <Text style={styles.reviewValue}>{address.zip}</Text>
              </View>

              <Text style={[styles.reviewSection, { marginTop: 12 }]}>
                Professional
              </Text>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewKey}>Job Title</Text>
                <Text style={styles.reviewValue}>{professional.job}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewKey}>Company</Text>
                <Text style={styles.reviewValue}>{professional.company}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewKey}>Experience</Text>
                <Text style={styles.reviewValue}>{professional.exp}</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* BOTTOM BUTTONS */}
        <View style={styles.bottomBar}>
          {step > 0 && (
            <TouchableOpacity style={styles.backBtn} onPress={back}>
              <Text style={{ color: "#333" }}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextBtn, step === 0 && { width: "100%" }]}
            onPress={next}
          >
            <Text style={{ color: "#fff" }}>
              {step === 3 ? "Submit" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F7F7F7" },

  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { fontSize: 13, color: "#777" },
  stepText: { marginTop: 10 },

  uploadRow: { flexDirection: "row", marginVertical: 15, gap: 15 },
  avatar: { width: 60, height: 60, backgroundColor: "#ddd", borderRadius: 50 },

  inputBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 14,
  },

  dobRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 14,
  },
  dobBox: {
    width: "30%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
  },

  inputField: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 14,
  },

  modalBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000055",
  },

  dropdown: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 200,
  },

  dropdownItem: { padding: 10, fontSize: 15 },

  bottomBar: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    justifyContent: "space-evenly",
    borderTopWidth: 0.5,
    borderColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },

  nextBtn: {
    width: "50%",
    backgroundColor: "#0B3D91",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  backBtn: {
    width: "45%",
    backgroundColor: "#ddd",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginRight: 10,
  },

  // ── Labels ──
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginBottom: 2,
    marginTop: 4,
  },

  subText: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B3D91",
    marginBottom: 10,
    marginTop: 6,
  },

  // ── Review ──
  reviewCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },

  reviewTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  reviewSection: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0B3D91",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  reviewItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },

  reviewKey: {
    fontSize: 13,
    color: "#888",
  },

  reviewValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
  },
});
