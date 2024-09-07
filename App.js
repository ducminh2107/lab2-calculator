import React, { useState } from "react"; // Import React và useState để sử dụng state trong component
import { Text, View, TouchableOpacity, StyleSheet } from "react-native"; // Import các component từ React Native
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons để sử dụng các icon

export default function Calculator() {
  // Khởi tạo các state để quản lý các giá trị trong ứng dụng
  const [display, setDisplay] = useState("0"); // State để hiển thị số đang nhập
  const [currentValue, setCurrentValue] = useState(null); // State để lưu giá trị trước khi thực hiện phép toán
  const [operator, setOperator] = useState(null); // State để lưu phép toán hiện tại
  const [currentExpression, setCurrentExpression] = useState(""); // State để lưu biểu thức hiện tại
  const [isDarkMode, setIsDarkMode] = useState(false); // State để quản lý chế độ sáng/tối
  const [history, setHistory] = useState([]); // State để lưu lịch sử các phép toán đã thực hiện

  // Hàm xử lý khi bấm vào các nút
  const handlePress = (input) => {
    if (["+", "-", "*", "/"].includes(input)) {
      // Khi người dùng bấm một phép toán
      setCurrentValue(display); // Lưu giá trị hiện tại vào currentValue
      setOperator(input); // Lưu phép toán vào operator
      setCurrentExpression(currentExpression + ` ${display} ${input}`); // Cập nhật biểu thức
      setDisplay("0"); // Đặt lại màn hình hiển thị
    } else if (input === "=") {
      // Khi người dùng bấm "=" để tính toán
      if (operator && currentValue !== null) {
        let result;
        // Thực hiện phép toán dựa trên operator
        switch (operator) {
          case "+":
            result = parseFloat(currentValue) + parseFloat(display);
            break;
          case "-":
            result = parseFloat(currentValue) - parseFloat(display);
            break;
          case "*":
            result = parseFloat(currentValue) * parseFloat(display);
            break;
          case "/":
            result = parseFloat(currentValue) / parseFloat(display);
            break;
          default:
            return;
        }
        const finalResult = formatNumber(result); // Định dạng kết quả với dấu phẩy
        setDisplay(finalResult); // Hiển thị kết quả
        setCurrentExpression(`${currentExpression} ${display} =`); // Cập nhật biểu thức
        setHistory([
          ...history,
          `${currentExpression} ${display} = ${finalResult}`,
        ]); // Thêm phép tính vào lịch sử
        setCurrentValue(null); // Reset giá trị hiện tại
        setOperator(null); // Reset phép toán hiện tại
      }
    } else if (input === "C") {
      // Khi người dùng bấm nút C (Clear)
      setDisplay("0"); // Reset màn hình hiển thị
      setCurrentValue(null); // Reset giá trị hiện tại
      setOperator(null); // Reset phép toán hiện tại
      setCurrentExpression(""); // Reset biểu thức hiện tại
    } else if (input === "CE") {
      // Khi người dùng bấm CE (Clear Entry)
      setDisplay("0"); // Reset màn hình hiển thị
      setCurrentValue(null); // Reset giá trị hiện tại
      setOperator(null); // Reset phép toán hiện tại
      setCurrentExpression(""); // Reset biểu thức hiện tại
    } else if (input === "%") {
      // Khi người dùng bấm nút %
      const percentage = parseFloat(display) / 100; // Tính phần trăm
      setDisplay(percentage.toString()); // Hiển thị kết quả
      setCurrentExpression(currentExpression + ` ${display}%`); // Cập nhật biểu thức
    } else if (input === "<x>") {
      // Khi người dùng bấm nút xóa (Backspace)
      setDisplay(display.length > 1 ? display.slice(0, -1) : "0"); // Xóa một ký tự trên màn hình hiển thị
    } else if (input === ".") {
      // Khi người dùng bấm dấu chấm (decimal point)
      if (!display.includes(".")) {
        setDisplay(display + "."); // Thêm dấu chấm nếu chưa có
      }
    } else {
      setDisplay(display === "0" ? input : display + input); // Cập nhật màn hình hiển thị khi bấm số
    }
  };

  // Hàm chuyển đổi giữa chế độ sáng và tối
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Hàm định dạng số với dấu phẩy
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Hàm render một nút
  const renderButton = (text, color) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]} // Đặt màu nền nút
      onPress={() => handlePress(text)} // Xử lý khi bấm nút
    >
      <Text
        style={[
          styles.buttonText,
          isDarkMode ? styles.textDark : styles.textLight,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );

  // Hàm mở lịch sử tính toán
  const openHistory = () => {
    alert("History: \n\n" + history.join("\n\n")); // Hiển thị lịch sử tính toán
  };

  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.darkMode : styles.lightMode,
      ]}
    >
      {/* Phần đầu chứa nút sáng/tối và lịch sử */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons
            name={isDarkMode ? "moon" : "sunny"}
            size={40}
            color={isDarkMode ? "#fff" : "#000"}
            onPress={toggleTheme} // Xử lý khi bấm nút sáng/tối
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons
            name="time-outline"
            size={40}
            color={isDarkMode ? "#fff" : "#000"}
            onPress={openHistory} // Xử lý khi bấm nút lịch sử
          />
        </TouchableOpacity>
      </View>

      {/* Màn hình hiển thị biểu thức và kết quả */}
      <View style={styles.displayContainer}>
        <Text
          style={[
            styles.expressionText,
            isDarkMode ? styles.textDark : styles.textLight,
          ]}
        >
          {currentExpression} {/* Hiển thị biểu thức hiện tại */}
        </Text>
        <Text
          style={[
            styles.displayText,
            isDarkMode ? styles.textDark : styles.textLight,
          ]}
        >
          {display} {/* Hiển thị giá trị hiện tại */}
        </Text>
      </View>

      {/* Các hàng nút bấm */}
      <View style={styles.buttonRow}>
        {renderButton("CE", "#528B8B")}
        {renderButton("C", "#528B8B")}
        {renderButton("%", "#528B8B")}
        {renderButton("/", "#FF9900")}
      </View>
      <View style={styles.buttonRow}>
        {renderButton("7", "#999999")}
        {renderButton("8", "#999999")}
        {renderButton("9", "#999999")}
        {renderButton("*", "#FF9900")}
      </View>
      <View style={styles.buttonRow}>
        {renderButton("4", "#999999")}
        {renderButton("5", "#999999")}
        {renderButton("6", "#999999")}
        {renderButton("-", "#FF9900")}
      </View>
      <View style={styles.buttonRow}>
        {renderButton("1", "#999999")}
        {renderButton("2", "#999999")}
        {renderButton("3", "#999999")}
        {renderButton("+", "#FF9900")}
      </View>
      <View style={styles.buttonRow}>
        {renderButton(".", "#999999")}
        {renderButton("0", "#999999")}
        {renderButton("<x>", "#999999")}
        {renderButton("=", "#FF9900")}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between", // Đẩy hai nút cách xa nhau
    alignItems: "center", // Canh giữa theo chiều dọc
    paddingHorizontal: 20, // Thêm khoảng cách ngang
    marginBottom: 20,
  },
  iconButton: {
    backgroundColor: "#D3D3D3", // Màu nền xám
    borderRadius: 25, // Bo tròn nút (cho nút vuông 50x50, đường kính 25 tạo ra bo tròn hoàn chỉnh)
    padding: 10, // Thêm khoảng cách bên trong nút
    justifyContent: "center",
    alignItems: "center",
  },
  displayContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "flex-end",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  displayText: {
    fontSize: 40,
  },
  expressionText: {
    fontSize: 20,
    color: "#999999",
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
  },
  button: {
    flex: 1,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 40,
  },
  buttonText: {
    fontSize: 30,
  },
  textLight: {
    color: "#000",
  },
  textDark: {
    color: "#fff",
  },
  lightMode: {
    backgroundColor: "#f5f5f5",
  },
  darkMode: {
    backgroundColor: "#000",
  },
});
