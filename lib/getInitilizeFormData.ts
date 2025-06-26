export const getInitilizeData = (data: any) => {
  if (!data) {
    return [
      { name: "", description: "", languageId: "uz" },
      { name: "", description: "", languageId: "ru" },
    ];
  }
  return data.map((item: any) => ({
    productId: item?.productId,
    languageId: item?.language?.code,
    name: item?.name,
    description: item?.description,
  }));
};

export const getInitilizeCategoryFormData = (data: any) => {
  if (!data) {
    return [
      { name: "", languageId: "uz" },
      { name: "", languageId: "ru" },
    ];
  }
  return data.map((item: any) => ({
    languageId: item?.language?.code,
    name: item?.name,
  }));
};
