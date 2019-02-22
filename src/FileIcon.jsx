const FileIcon = ({ filename }) => {
  if (!filename.includes('.')) {
    return null;
  }

  const isMap = filename.endsWith('.map');

  if (isMap) {
    return '🗺️';
  }

  return '📄';
};

export default FileIcon;
