export const getImageUrl = (data: any) => {
  if (data) {
    return data.map((image: any) => image.url);
  }
  return [];
};
