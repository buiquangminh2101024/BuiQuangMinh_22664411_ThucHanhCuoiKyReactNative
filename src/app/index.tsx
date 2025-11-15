import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useExpenseRepository, Movie } from "../../db/db";
import { useRouter } from "expo-router";

export default function Index() {
  const { findAll, update } = useExpenseRepository();
  const router = useRouter();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMovies = async () => {
    const data = await findAll();
    setMovies(data);
  };

  useEffect(() => {
    (async () => {
      await loadMovies();
      setLoading(false);
    })();
  }, []);

  const toggleWatched = async (movie: Movie) => {
    const updatedMovie: Movie = {
      ...movie,
      watched: movie.watched === 1 ? 0 : 1,
      created_at: new Date(),
    };

    await update(updatedMovie);
    await loadMovies(); // refresh UI
  };

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
        renderItem={({ item }) => {
          const watched = item.watched === 1;

          return (
            <TouchableOpacity
              onPress={() => toggleWatched(item)}
              className={`p-4 mb-3 rounded-xl border 
                ${watched ? "border-green-600 bg-green-50" : "border-gray-300"}
              `}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text
                    className={`text-lg font-bold ${
                      watched ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {item.title}
                  </Text>

                  <Text className="text-gray-600">Năm: {item.year}</Text>

                  <Text className="text-gray-600">
                    Lượt xem: {item.watched}
                  </Text>

                  {item.rating !== undefined && (
                    <Text className="text-yellow-600">
                      Đánh giá: {item.rating} ⭐
                    </Text>
                  )}
                </View>

                {watched && (
                  <Text className="text-green-600 text-2xl font-bold">✓</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Nút thêm phim */}
      <TouchableOpacity
        className="bg-blue-600 p-4 rounded-xl mt-4"
        onPress={() => router.push("/add")}
      >
        <Text className="text-center text-white font-bold text-lg">
          ➕ Thêm phim mới
        </Text>
      </TouchableOpacity>
    </View>
  );
}
