import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useExpenseRepository, Movie } from "../../db/db";

export default function EditMovieScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { findById, update } = useExpenseRepository();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [open, setOpen] = useState(true);

  // Form values
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");

  // Load movie by ID
  useEffect(() => {
    (async () => {
      if (!id) return;
      const m = await findById(id);
      setMovie(m);

      // Fill form
      setTitle(m.title);
      setYear(m.year ? String(m.year) : "");
      setRating(m.rating ? String(m.rating) : "");
    })();
  }, []);

  // Validate + update
  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Title không được để trống");
      return;
    }

    const currentYear = new Date().getFullYear();

    if (year) {
      const y = Number(year);
      if (isNaN(y) || y < 1900 || y > currentYear) {
        Alert.alert("Lỗi", `Year phải từ 1900 → ${currentYear}`);
        return;
      }
    }

    if (rating) {
      const r = Number(rating);
      if (isNaN(r) || r < 1 || r > 5) {
        Alert.alert("Lỗi", "Rating phải từ 1 → 5");
        return;
      }
    }

    if (!movie) return;

    const updatedMovie: Movie = {
      ...movie,
      title,
      year: year ? Number(year) : null,
      rating: rating ? Number(rating) : undefined,
      created_at: new Date(),
    };

    await update(updatedMovie);

    Alert.alert("Thành công", "Đã cập nhật phim!");
    setOpen(false);
    router.replace("/"); // về trang danh sách + refresh
  };

  if (!movie) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <Modal visible={open} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-center p-6">
        <View className="bg-white rounded-xl p-6">

          <Text className="text-xl font-bold mb-4">Chỉnh sửa phim</Text>

          {/* Title */}
          <Text className="font-medium">Title *</Text>
          <TextInput
            className="border p-2 rounded mb-3"
            value={title}
            onChangeText={setTitle}
          />

          {/* Year */}
          <Text className="font-medium">Year</Text>
          <TextInput
            className="border p-2 rounded mb-3"
            keyboardType="numeric"
            value={year}
            onChangeText={setYear}
          />

          {/* Rating */}
          <Text className="font-medium">Rating (1–5)</Text>
          <TextInput
            className="border p-2 rounded mb-3"
            keyboardType="numeric"
            value={rating}
            onChangeText={setRating}
          />

          {/* Buttons */}
          <View className="flex-row justify-end mt-4">
            <TouchableOpacity
              className="mr-3 px-4 py-2 bg-gray-300 rounded"
              onPress={() => router.push("/")}
            >
              <Text>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-4 py-2 bg-blue-600 rounded"
              onPress={handleSave}
            >
              <Text className="text-white">Lưu</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}
