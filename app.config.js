export default {
  expo: {
    name: "yemek-tarif-mobil",
    slug: "yemek-tarif-mobil",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "yemektarifmobil",
    userInterfaceStyle: "automatic",
    android: {
      hermesEnabled: false,
      package: "com.zlhylcn.yemektarifmobil",  // ← BURAYI EKLEDİK ✅
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    ios: {
      supportsTablet: true
    },
    web: {
      favicon: "./assets/images/favicon.png"
    },
    extra: {
      eas: {
        projectId: "4d028743-235e-42fc-8150-17b2aae46486"
      }
    }
  }
}
