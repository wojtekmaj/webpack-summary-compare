import PropTypes from 'prop-types';

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

FileIcon.propTypes = {
  filename: PropTypes.string.isRequired,
};

export default FileIcon;
