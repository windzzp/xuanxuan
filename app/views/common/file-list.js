import React, {Component, PropTypes} from 'react';
import HTML from '../../utils/html-helper';
import FileListItem from './file-list-item';

class FileList extends Component {
    static propTypes = {
        files: PropTypes.array.isRequired,
        listItemProps: PropTypes.object,
        className: PropTypes.string,
    };

    static defaultProps = {
        className: null,
        listItemProps: null,
    };

    render() {
        const {
            files,
            className,
            listItemProps,
            ...other
        } = this.props;

        return (<div
            {...other}
            className={HTML.classes('app-file-list list', className)}
        >
            {
                files.map(file => (<FileListItem {...listItemProps} key={file.id} file={file} />))
            }
        </div>);
    }
}

export default FileList;
