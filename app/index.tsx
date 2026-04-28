import StepHeader from "@/components/StepIndicator";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
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

  // ── Local state — pre-filled from Redux (persisted) on mount ──
  const [form, setForm] = useState({
    gender: personal.gender || "",
    dob: personal.dob || { dd: "", mm: "", yy: "" },
    nationality: personal.nationality || "",
    height: personal.height || "",
  });

  const [addr, setAddr] = useState({
    city: address.city || "",
    state: address.state || "",
    zip: address.zip || "",
  });

  const [prof, setProf] = useState({
    job: professional.job || "",
    company: professional.company || "",
    exp: professional.exp || "",
  });

  // ── Error states ──
  const [errors, setErrors] = useState({
    gender: "",
    dob: "",
    nationality: "",
    height: "",
    city: "",
    state: "",
    zip: "",
    job: "",
    company: "",
    exp: "",
  });
  // Add this state in your component (after other useState declarations)
  const [profileImage, setProfileImage] = useState<string | null>(
    personal.profileImage,
  );
  const [imageError, setImageError] = useState("");

  // ── Sync local state when redux rehydrates from AsyncStorage ──
  useEffect(() => {
    setForm({
      gender: personal.gender || "",
      dob: personal.dob || { dd: "", mm: "", yy: "" },
      nationality: personal.nationality || "",
      height: personal.height || "",
    });
  }, [personal]);

  useEffect(() => {
    setAddr({
      city: address.city || "",
      state: address.state || "",
      zip: address.zip || "",
    });
  }, [address]);

  useEffect(() => {
    setProf({
      job: professional.job || "",
      company: professional.company || "",
      exp: professional.exp || "",
    });
  }, [professional]);

  // ── Date Picker state ──
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    // Restore date from persisted dob if available
    const { dd, mm, yy } = personal.dob || {};
    if (dd && mm && yy) {
      return new Date(Number(yy), Number(mm) - 1, Number(dd));
    }
    return new Date(2000, 0, 1);
  });

  // ── Gender Modal ──
  const [showGender, setShowGender] = useState(false);

  // ── Handle date picker change ──
  const onDateChange = (_: any, date?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const yy = String(date.getFullYear());
      setForm((prev) => ({ ...prev, dob: { dd, mm, yy } }));
      // Clear dob error when date is selected
      if (errors.dob) setErrors((prev) => ({ ...prev, dob: "" }));
    }
  };

  const formattedDOB =
    form.dob.dd && form.dob.mm && form.dob.yy
      ? `${form.dob.dd}/${form.dob.mm}/${form.dob.yy}`
      : "";

  // ── Validation functions ──
  const validateStep0 = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate gender
    if (!form.gender) {
      newErrors.gender = "Please select gender";
      isValid = false;
    } else {
      newErrors.gender = "";
    }

    // Validate DOB
    const { dd, mm, yy } = form.dob;
    if (!dd || !mm || !yy) {
      newErrors.dob = "Please select date of birth";
      isValid = false;
    } else if (Number(dd) < 1 || Number(dd) > 31) {
      newErrors.dob = "Invalid day (1-31)";
      isValid = false;
    } else if (Number(mm) < 1 || Number(mm) > 12) {
      newErrors.dob = "Invalid month (1-12)";
      isValid = false;
    } else if (Number(yy) < 1900 || Number(yy) > new Date().getFullYear()) {
      newErrors.dob = `Invalid year (1900-${new Date().getFullYear()})`;
      isValid = false;
    } else {
      newErrors.dob = "";
    }

    // Validate nationality
    if (!form.nationality.trim()) {
      newErrors.nationality = "Please enter nationality";
      isValid = false;
    } else if (form.nationality.length < 2) {
      newErrors.nationality = "Nationality must be at least 2 characters";
      isValid = false;
    } else {
      newErrors.nationality = "";
    }

    // Validate height
    if (!form.height.trim()) {
      newErrors.height = "Please enter height";
      isValid = false;
    } else {
      const heightNum = Number(form.height);
      if (isNaN(heightNum) || heightNum < 50 || heightNum > 300) {
        newErrors.height = "Please enter valid height (50-300 cm)";
        isValid = false;
      } else {
        newErrors.height = "";
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep1 = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate city
    if (!addr.city.trim()) {
      newErrors.city = "Please enter city name";
      isValid = false;
    } else if (addr.city.length < 2) {
      newErrors.city = "City name must be at least 2 characters";
      isValid = false;
    } else {
      newErrors.city = "";
    }

    // Validate state
    if (!addr.state.trim()) {
      newErrors.state = "Please enter state name";
      isValid = false;
    } else if (addr.state.length < 2) {
      newErrors.state = "State name must be at least 2 characters";
      isValid = false;
    } else {
      newErrors.state = "";
    }

    // Validate zip
    if (!addr.zip.trim()) {
      newErrors.zip = "Please enter ZIP/Postal code";
      isValid = false;
    } else if (!/^\d{5,6}$/.test(addr.zip)) {
      newErrors.zip = "Please enter valid ZIP code (5-6 digits)";
      isValid = false;
    } else {
      newErrors.zip = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate job title
    if (!prof.job.trim()) {
      newErrors.job = "Please enter job title";
      isValid = false;
    } else if (prof.job.length < 2) {
      newErrors.job = "Job title must be at least 2 characters";
      isValid = false;
    } else {
      newErrors.job = "";
    }

    // Validate company
    if (!prof.company.trim()) {
      newErrors.company = "Please enter company name";
      isValid = false;
    } else if (prof.company.length < 2) {
      newErrors.company = "Company name must be at least 2 characters";
      isValid = false;
    } else {
      newErrors.company = "";
    }

    // Validate experience
    if (!prof.exp.trim()) {
      newErrors.exp = "Please enter years of experience";
      isValid = false;
    } else {
      const expNum = Number(prof.exp);
      if (isNaN(expNum) || expNum < 0 || expNum > 50) {
        newErrors.exp = "Please enter valid experience (0-50 years)";
        isValid = false;
      } else {
        newErrors.exp = "";
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // ── Navigation ──
  const next = () => {
    if (step === 0) {
      if (!validateStep0()) {
        Alert.alert("Error", "Please fix the errors before proceeding");
        return;
      }
      dispatch(savePersonal({ ...form, profileImage: profileImage }));
      dispatch(setStep(1));
    } else if (step === 1) {
      if (!validateStep1()) {
        Alert.alert("Error", "Please fix the errors before proceeding");
        return;
      }
      dispatch(saveAddress(addr));
      dispatch(setStep(2));
    } else if (step === 2) {
      if (!validateStep2()) {
        Alert.alert("Error", "Please fix the errors before proceeding");
        return;
      }
      dispatch(saveProfessional(prof));
      dispatch(setStep(3));
    } else {
      Alert.alert("Success", "Form Submitted!");
      dispatch(resetForm());
      setProfileImage("");
    }
  };

  const back = () => {
    if (step > 0) dispatch(setStep(step - 1));
  };

  // Add this function to handle image picking
  const pickImage = async () => {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Needed",
          "Please allow access to your photos to upload profile picture",
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5, // Compress image to reduce size
        base64: true, // This will give us base64 string
      });

      if (!result.canceled && result.assets[0].base64) {
        const base64String = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setProfileImage(base64String);
        setImageError("");

        // Optional: Save to Redux if you want to persist
        // dispatch(saveProfileImage(base64String));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // ── UI ──
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>You are almost done!</Text>
          <Text style={styles.subtitle}>
            Continue below details to complete your profile
          </Text>
          <Text style={styles.stepText}>Step {step + 1}</Text>
          <StepHeader step={step} />

          {/* ─────────── STEP 1 — Personal ─────────── */}
          {step === 0 && (
            <>
              {/* Upload photo */}
              <View style={styles.uploadRow}>
                <TouchableOpacity
                  onPress={pickImage}
                  style={styles.avatarContainer}
                >
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={styles.avatar}>
                      <Ionicons name="camera" size={24} color="#888" />
                    </View>
                  )}
                </TouchableOpacity>
                <View>
                  <Text style={styles.label}>Upload your photo</Text>
                  <Text style={styles.subText}>
                    Kindly upload your professional photo
                  </Text>
                  {imageError ? (
                    <Text style={styles.errorText}>{imageError}</Text>
                  ) : null}
                </View>
              </View>
              {/* Gender */}
              <Text style={styles.label}>Gender</Text>
              <TouchableOpacity
                style={[styles.inputBox, errors.gender && styles.inputError]}
                onPress={() => setShowGender(true)}
              >
                <Text style={{ color: form.gender ? "#000" : "#aaa" }}>
                  {form.gender || "Select Gender"}
                </Text>
                <Ionicons name="chevron-down" size={18} />
              </TouchableOpacity>
              {errors.gender ? (
                <Text style={styles.errorText}>{errors.gender}</Text>
              ) : null}

              <Modal visible={showGender} transparent>
                <TouchableOpacity
                  style={styles.modalBg}
                  onPress={() => setShowGender(false)}
                >
                  <View style={styles.dropdown}>
                    {["Male", "Female", "Other"].map((g) => (
                      <TouchableOpacity
                        key={g}
                        onPress={() => {
                          setForm({ ...form, gender: g });
                          setShowGender(false);
                          if (errors.gender)
                            setErrors((prev) => ({ ...prev, gender: "" }));
                        }}
                      >
                        <Text style={styles.dropdownItem}>{g}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </TouchableOpacity>
              </Modal>

              {/* Date of Birth — Date Picker */}
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                style={[styles.inputBox, errors.dob && styles.inputError]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: formattedDOB ? "#000" : "#aaa" }}>
                  {formattedDOB || "Select Date of Birth"}
                </Text>
                <Ionicons name="calendar-outline" size={18} color="#555" />
              </TouchableOpacity>
              {errors.dob ? (
                <Text style={styles.errorText}>{errors.dob}</Text>
              ) : null}

              {/* iOS picker — bottom sheet modal */}
              {Platform.OS === "ios" ? (
                <Modal
                  visible={showDatePicker}
                  transparent
                  animationType="slide"
                >
                  <View style={styles.iosPickerBg}>
                    <View style={styles.iosPickerContainer}>
                      <View style={styles.iosPickerHeader}>
                        <TouchableOpacity
                          onPress={() => setShowDatePicker(false)}
                        >
                          <Text style={styles.iosPickerCancel}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setShowDatePicker(false)}
                        >
                          <Text style={styles.iosPickerDone}>Done</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="spinner"
                        onChange={onDateChange}
                        maximumDate={new Date()}
                        minimumDate={new Date(1900, 0, 1)}
                        style={{ width: "100%" }}
                      />
                    </View>
                  </View>
                </Modal>
              ) : (
                // Android — native bottom picker
                showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                    minimumDate={new Date(1900, 0, 1)}
                  />
                )
              )}

              {/* Nationality */}
              <Text style={styles.label}>Nationality</Text>
              <TextInput
                placeholder="Enter your nationality"
                style={[
                  styles.inputField,
                  errors.nationality && styles.inputError,
                ]}
                value={form.nationality}
                onChangeText={(t) => {
                  setForm({ ...form, nationality: t });
                  if (errors.nationality)
                    setErrors((prev) => ({ ...prev, nationality: "" }));
                }}
              />
              {errors.nationality ? (
                <Text style={styles.errorText}>{errors.nationality}</Text>
              ) : null}

              {/* Height */}
              <Text style={styles.label}>Height</Text>
              <TextInput
                placeholder="Enter your height (e.g. 175 cm)"
                style={[styles.inputField, errors.height && styles.inputError]}
                value={form.height}
                onChangeText={(t) => {
                  setForm({ ...form, height: t });
                  if (errors.height)
                    setErrors((prev) => ({ ...prev, height: "" }));
                }}
                keyboardType="numeric"
                returnKeyType="done"
              />
              {errors.height ? (
                <Text style={styles.errorText}>{errors.height}</Text>
              ) : null}
            </>
          )}

          {/* ─────────── STEP 2 — Address ─────────── */}
          {step === 1 && (
            <>
              <Text style={styles.sectionTitle}>Address Information</Text>

              <Text style={styles.label}>City</Text>
              <TextInput
                placeholder="Enter your city"
                style={[styles.inputField, errors.city && styles.inputError]}
                value={addr.city}
                onChangeText={(t) => {
                  setAddr({ ...addr, city: t });
                  if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
                }}
                returnKeyType="next"
              />
              {errors.city ? (
                <Text style={styles.errorText}>{errors.city}</Text>
              ) : null}

              <Text style={styles.label}>State</Text>
              <TextInput
                placeholder="Enter your state"
                style={[styles.inputField, errors.state && styles.inputError]}
                value={addr.state}
                onChangeText={(t) => {
                  setAddr({ ...addr, state: t });
                  if (errors.state)
                    setErrors((prev) => ({ ...prev, state: "" }));
                }}
                returnKeyType="next"
              />
              {errors.state ? (
                <Text style={styles.errorText}>{errors.state}</Text>
              ) : null}

              <Text style={styles.label}>ZIP / Postal Code</Text>
              <TextInput
                placeholder="Enter your ZIP code"
                style={[styles.inputField, errors.zip && styles.inputError]}
                value={addr.zip}
                onChangeText={(t) => {
                  setAddr({ ...addr, zip: t });
                  if (errors.zip) setErrors((prev) => ({ ...prev, zip: "" }));
                }}
                keyboardType="numeric"
                returnKeyType="done"
              />
              {errors.zip ? (
                <Text style={styles.errorText}>{errors.zip}</Text>
              ) : null}
            </>
          )}

          {/* ─────────── STEP 3 — Professional ─────────── */}
          {step === 2 && (
            <>
              <Text style={styles.sectionTitle}>Professional Information</Text>

              <Text style={styles.label}>Job Title</Text>
              <TextInput
                placeholder="e.g. Software Engineer"
                style={[styles.inputField, errors.job && styles.inputError]}
                value={prof.job}
                onChangeText={(t) => {
                  setProf({ ...prof, job: t });
                  if (errors.job) setErrors((prev) => ({ ...prev, job: "" }));
                }}
                returnKeyType="next"
              />
              {errors.job ? (
                <Text style={styles.errorText}>{errors.job}</Text>
              ) : null}

              <Text style={styles.label}>Company Name</Text>
              <TextInput
                placeholder="e.g. Google, Infosys"
                style={[styles.inputField, errors.company && styles.inputError]}
                value={prof.company}
                onChangeText={(t) => {
                  setProf({ ...prof, company: t });
                  if (errors.company)
                    setErrors((prev) => ({ ...prev, company: "" }));
                }}
                returnKeyType="next"
              />
              {errors.company ? (
                <Text style={styles.errorText}>{errors.company}</Text>
              ) : null}

              <Text style={styles.label}>Years of Experience</Text>
              <TextInput
                placeholder="e.g. 3"
                style={[styles.inputField, errors.exp && styles.inputError]}
                value={prof.exp}
                onChangeText={(t) => {
                  setProf({ ...prof, exp: t });
                  if (errors.exp) setErrors((prev) => ({ ...prev, exp: "" }));
                }}
                keyboardType="numeric"
                returnKeyType="done"
              />
              {errors.exp ? (
                <Text style={styles.errorText}>{errors.exp}</Text>
              ) : null}
            </>
          )}

          {/* ─────────── STEP 4 — Review ─────────── */}
          {/* ─────────── STEP 4 — Review ─────────── */}
          {step === 3 && (
            <View style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>Review Details</Text>

              {/* Profile Image Section */}
              <View style={styles.reviewImageSection}>
                {personal.profileImage ? (
                  <Image
                    source={{ uri: personal.profileImage }}
                    style={styles.reviewAvatar}
                  />
                ) : (
                  <View
                    style={[
                      styles.reviewAvatar,
                      styles.reviewAvatarPlaceholder,
                    ]}
                  >
                    <Ionicons name="person" size={40} color="#999" />
                  </View>
                )}
                <Text style={styles.reviewImageText}>Profile Photo</Text>
              </View>

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
                <Text style={styles.reviewValue}>{professional.exp} years</Text>
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

  inputBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 14,
  },

  inputField: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 14,
  },

  inputError: {
    borderWidth: 1,
    borderColor: "#FF3B30",
  },

  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 8,
    marginLeft: 4,
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

  // iOS Date Picker bottom sheet
  iosPickerBg: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#00000055",
  },
  iosPickerContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
  iosPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  iosPickerCancel: { fontSize: 15, color: "#999" },
  iosPickerDone: { fontSize: 15, color: "#0B3D91", fontWeight: "700" },

  bottomBar: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    justifyContent: "space-evenly",
    borderTopWidth: 0.5,
    borderColor: "#ddd",
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

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginBottom: 2,
    marginTop: 4,
  },
  subText: { fontSize: 12, color: "#888", marginTop: 2 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B3D91",
    marginBottom: 10,
    marginTop: 6,
  },
  uploadRow: {
    flexDirection: "row",
    marginVertical: 15,
    gap: 15,
    alignItems: "center",
  },

  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    overflow: "hidden",
  },

  avatar: {
    width: 60,
    height: 60,
    backgroundColor: "#E0E0E0",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  reviewCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },

  reviewTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#0B3D91",
    textAlign: "center",
  },

  reviewImageSection: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  reviewAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },

  reviewAvatarPlaceholder: {
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },

  reviewImageText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  reviewSection: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B3D91",
    marginBottom: 8,
    marginTop: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  reviewItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },

  reviewKey: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
  },

  reviewValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
    flex: 1,
    textAlign: "right",
    marginLeft: 10,
  },
});
