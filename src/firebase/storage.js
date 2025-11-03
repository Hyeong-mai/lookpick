import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { storage } from "./config";

// 파일 업로드
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      path: snapshot.ref.fullPath,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    throw error;
  }
};

// 여러 파일 업로드 (서비스 등록용)
export const uploadMultipleFiles = async (
  files,
  basePath,
  serviceId = null
) => {
  try {
    if (serviceId === null && typeof basePath === "string") {
      // 새로운 방식: basePath가 문자열이고 serviceId가 없는 경우
      const uploadPromises = files.map((file, index) => {
        const fileName = `${Date.now()}_${index}_${file.name}`;
        const path = `${basePath}/${fileName}`;
        return uploadFile(file, path);
      });

      const uploadResults = await Promise.all(uploadPromises);
      return uploadResults;
    } else {
      // 기존 방식: 호환성을 위해 유지 (userId, serviceId)
      const userId = basePath;
      const uploadPromises = files.map((file, index) => {
        const fileName = `${Date.now()}_${index}_${file.name}`;
        const path = `services/${userId}/${serviceId}/${fileName}`;
        return uploadFile(file, path);
      });

      const uploadResults = await Promise.all(uploadPromises);
      return uploadResults;
    }
  } catch (error) {
    throw error;
  }
};

// 사용자 프로필 이미지 업로드
export const uploadProfileImage = async (file, userId) => {
  try {
    const fileName = `profile_${Date.now()}_${file.name}`;
    const path = `users/${userId}/profile/${fileName}`;
    return await uploadFile(file, path);
  } catch (error) {
    throw error;
  }
};

// 사업자등록증 업로드
export const uploadBusinessCertificate = async (file, userId) => {
  try {
    const fileName = `business_cert_${Date.now()}_${file.name}`;
    const path = `users/${userId}/documents/${fileName}`;
    return await uploadFile(file, path);
  } catch (error) {
    throw error;
  }
};

// 파일 삭제
export const deleteFile = async (filePath) => {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
  } catch (error) {
    throw error;
  }
};

// 서비스 관련 모든 파일 삭제
export const deleteServiceFiles = async (userId, serviceId) => {
  try {
    // serviceId가 실제로는 전체 경로일 수 있으므로 유연하게 처리
    let folderPath;
    if (serviceId && serviceId.includes("/")) {
      // 이미 전체 경로인 경우
      folderPath = serviceId;
    } else if (userId && serviceId) {
      // userId와 serviceId가 별도로 제공된 경우
      folderPath = `services/${userId}/${serviceId}`;
    } else {
      // userId만 제공된 경우 (serviceId가 실제로는 경로)
      folderPath = `services/${userId}`;
    }

    const folderRef = ref(storage, folderPath);
    const listResult = await listAll(folderRef);

    const deletePromises = listResult.items.map((item) => deleteObject(item));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("파일 삭제 실패:", error);
    throw error;
  }
};

// 파일 다운로드 URL 가져오기
export const getFileDownloadURL = async (filePath) => {
  try {
    const storageRef = ref(storage, filePath);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    throw error;
  }
};
