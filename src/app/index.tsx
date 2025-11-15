import { View, Text, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { useExpenseRepository, Movie } from "../../db/db";

export default function Index() {
  const { findAll } = useExpenseRepository();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await findAll();
        setMovies(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Đang tải...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="p-4 mb-3 rounded-xl border border-gray-300">
            <Text className="text-lg font-bold">{item.title}</Text>
            <Text className="text-gray-600">Năm: {item.year}</Text>
            <Text className="text-gray-600">Lượt xem: {item.watched}</Text>

            {item.rating !== undefined && (
              <Text className="text-yellow-600">Đánh giá: {item.rating} ⭐</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}