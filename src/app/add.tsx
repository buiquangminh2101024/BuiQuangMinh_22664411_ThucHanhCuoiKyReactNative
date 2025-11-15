import { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useExpenseRepository } from "../../db/db";
import { useRouter } from "expo-router";

export default function AddMovieScreen() {
  const { add } = useExpenseRepository();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");

  const resetForm = () => {
    setTitle("");
    setYear("");
    setRating("");
  };

  const handleAdd = async () => {
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

    await add({
      id: Date.now().toString(),
      title,
      year: year ? Number(year) : null,
      watched: 0,
      rating: rating ? Number(rating) : undefined,
      created_at: new Date(),
    });

    Alert.alert("Thành công", "Đã thêm phim mới!");
    resetForm();
    setOpen(false);
  };

  return (
    <View className="flex-1 items-center justify-center p-4">

      {/* Nút mở modal thêm phim */}
      <TouchableOpacity
        className="bg-green-600 px-6 py-3 rounded-xl mb-6"
        onPress={() => setOpen(true)}
      >
        <Text className="text-white text-xl font-bold">+ Thêm phim</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={open} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-center p-6">
          <View className="bg-white rounded-xl p-6">
            <Text className="text-xl font-bold mb-4">Thêm phim mới</Text>

            {/* Title */}
            <Text className="font-medium">Title *</Text>
            <TextInput
              className="border p-2 rounded mb-3"
              placeholder="Nhập tên phim"
              value={title}
              onChangeText={setTitle}
            />

            {/* Year */}
            <Text className="font-medium">Year</Text>
            <TextInput
              className="border p-2 rounded mb-3"
              placeholder="VD: 1999"
              keyboardType="numeric"
              value={year}
              onChangeText={setYear}
            />

            {/* Rating */}
            <Text className="font-medium">Rating (1–5)</Text>
            <TextInput
              className="border p-2 rounded mb-3"
              placeholder="VD: 4"
              keyboardType="numeric"
              value={rating}
              onChangeText={setRating}
            />

            {/* Buttons */}
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="mr-3 px-4 py-2 bg-gray-300 rounded"
                onPress={() => {
                  resetForm();
                  setOpen(false);
                }}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="px-4 py-2 bg-blue-600 rounded"
                onPress={handleAdd}
              >
                <Text className="text-white">Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Nút quay về Index */}
      <TouchableOpacity
        className="bg-gray-700 p-4 rounded-xl mt-4"
        onPress={() => router.push("/")}
      >
        <Text className="text-center text-white font-bold text-lg">
          ⬅ Quay về danh sách phim
        </Text>
      </TouchableOpacity>

    </View>
  );
}
