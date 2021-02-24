import React from 'react';
import AskModal from '../../../utils/Modal/AskModal';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class BankSelectModal extends React.Component {
    //visible, title, onConfirm, onCancel
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [
                {
                    headerName: 'BankCode',
                    field: 'bankCode',
                    width: '135px',
                    suppressSizeToFit: true,
                },
                {
                    headerName: 'BankName',
                    field: 'bankName',
                    width: '135px',
                    suppressSizeToFit: true,
                },
            ],
            rowData: [
                { bankCode: 'BC0001', bankName: '농협은행' },
                { bankCode: 'BC0002', bankName: '신한은행' },
                { bankCode: 'BC0003', bankName: '우리은행' },
                { bankCode: 'BC0004', bankName: '경남은행' },
            ],
        };
        this.onCellClicked = this.onCellClicked.bind(this);
    }
    onCellClicked(params) {
        console.log(params.data.bankName);
        this.props.bankNameHandler(params.data.bankName);
        this.props.onConfirm();
    }
    render() {
        return (
            <div>
                <AskModal
                    visible={this.props.visible}
                    title={this.props.title}
                    confirmText="확인"
                    cancelText="취소"
                    onConfirm={this.props.onConfirm}
                    onCancel={this.props.onCancel}
                >
                    <div
                        className="ag-theme-balham"
                        style={{
                            width: '270px',
                            height: '300px',
                        }}
                    >
                        <AgGridReact
                            columnDefs={this.state.columnDefs}
                            rowData={this.state.rowData}
                            onCellClicked={this.onCellClicked}
                        ></AgGridReact>
                    </div>
                </AskModal>
            </div>
        );
    }
}

export default BankSelectModal;
