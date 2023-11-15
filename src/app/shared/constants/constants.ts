export class Constants {
    public static readonly FIREBASE_TOKEN = 'fb-token';
    public static readonly OBJECT_ID_EMPTY = '000000000000000000000000';
    public static readonly TABLE_PARAM = {
        PAGE_SIZE: 40,
    };
    public static readonly LAYOUT_CONFIG = {
        DEFAULT_FULL: 1,
        DEFAULT_DUAL: 2,
        VT: 3,
        INIT: 99
    };
    public static readonly ACTIONS = {
        EDIT: 0,
        DELETE: 1,
    };
    public static readonly CASE_STUDY_ACTIONS = {
        OPEN_SLIDE: 0,
        REFRESH: 1,
        EDIT: 2,
        UPLOAD_SLIDE: 3,
        EDIT_PATIENT: 4,
        SHARE: 5,
        DELETE: 6,
        HISTORY_LOG: 7,
    };
    public static readonly REPORT_ACTIONS = {
        DISCARD: 0,
        SAVE: 1,
        APPROVE: 2,
        UNAPPROVE: 3,
        PRINT: 4,
        ADD: 5,
        KEY_IMAGES: 6,
        HISTORY: 7,
    };
    public static readonly UPLOAD_STATUS = {
        UPLOADING: 1,
        PROCESSING: 2,
        COMPLETED: 4,
        UPLOADING_PART: -2,
        ERROR: 69,
    };
    public static readonly UPLOAD_STATUS_LABEL = {
        [Constants.UPLOAD_STATUS.UPLOADING]: {
            label: 'Đang tải lên',
            color: 'text-orange-500',
        },
        [Constants.UPLOAD_STATUS.PROCESSING]: {
            label: 'Đang xử lý',
            color: 'text-orange-500',
        },
        [Constants.UPLOAD_STATUS.COMPLETED]: {
            label: 'Đã hoàn thành',
            color: 'text-green-500',
        },
        [Constants.UPLOAD_STATUS.UPLOADING_PART]: {
            label: 'Thất bại',
            color: 'text-red-500',
        },
        [Constants.UPLOAD_STATUS.ERROR]: {
            label: 'Thất bại',
            color: 'text-red-500',
        },
    };

    public static readonly UPLOAD_PROCESS_TYPE = {
        PROCESS_DONE: 'ProcessDone',
        PROCESS_ERROR: 'ProcessError',
        SERVICE_ERROR: 'ServiceError',
    };
    public static readonly DATA_TYPES = [
        { name: 'Number', code: 'NUM', keyValue: 1 },
        { name: 'Range', code: 'RAG', keyValue: 2 },
        { name: 'Boolean', code: 'BOOL', keyValue: 3 },
        { name: 'String', code: 'STR', keyValue: 4 },
        { name: 'Time', code: 'TIME', keyValue: 5 },
        { name: 'Date', code: 'DATE', keyValue: 6 },
        { name: 'DateTime', code: 'DATETI', keyValue: 7 },
        { name: 'SingleChoice', code: 'SINGC', keyValue: 8 },
        { name: 'MultipleChoice', code: 'MULC', keyValue: 9 },
        { name: 'Image', code: 'IMAGE', keyValue: 12 },
    ];
    public static readonly LABELING_MODE = [
        {
            label: 'Single(đơn)', value: 1
        },
        {
            label: 'Double(mù đôi)', value: 2
        },
        {
            label: 'Tripple(mù ba)', value: 3
        },
    ];
    public static readonly VALUE_TYPES = [
        {
            label: 'Áp dụng chung', value: 1
        },
        {
            label: 'Áp dụng cho nhóm', value: 2
        },
    ];
    public static readonly VALUE_TIME = [
        { label: 'hôm nay', value: '1' },
        { label: '3 ngày trước', value: '3' },
        { label: '7 ngày trước', value: '7' },
        { label: 'Tháng này', value: '10' },
    ];

    public static readonly FILTER_TYPES = {
        DROPDOWN: 'dropdown',
        STRING: 'string',
        NUMBER: 'number',
    };

    public static readonly VALUE_SORT = [
        { label: 'Tăng dần', value: 'asc' },
        { label: 'Giảm dần', value: 'desc' }
    ];
    public static readonly REQUEST_TYPES = [
        { label: 'Tế bào học', value: '1' },
        { label: 'Mô bệnh học', value: '2' },
        { label: 'Pap Smear', value: '3' },
    ];
    public static readonly GENDERS = [
        { label: 'Nam', value: '1' },
        { label: 'Nữ', value: '0' },
    ];
    public static readonly GENDERS_PAPSMEAR = [
        { label: 'Nữ', value: '0' },
        { label: 'Nam', value: '1' },
    ];
    public static readonly PATIENT_TYPES = [
        { label: 'Nội trú', value: '0' },
        { label: 'Ngoại trú', value: '1' },
    ];
    public static readonly MACHINE_TYPES = [
        { label: 'Motic', value: '1' },
        { label: 'Máy khác', value: '0' },
        { label: 'Ảnh chụp từ camera', value: '2' },
    ];
    public static readonly MACHINE_TYPES_V2 = [
        { label: 'Motic', value: 1 },
        { label: 'Máy khác', value: 0 },
        { label: 'Ảnh chụp từ camera', value: 2 },
    ];
    public static readonly REPORT_STATES = [
        { label: 'Đã chụp', value: '0' },
        { label: 'Đang đọc', value: '1' },
        { label: 'Chờ duyệt', value: '2' },
        { label: 'Đang duyệt', value: '3' },
        { label: 'Đã duyệt', value: '4' },
    ];
    public static readonly FILTER_STATES_1 = [
        { label: 'Tất cả', value: 10 },
        { label: 'Đã chụp', value: 1 },
        { label: 'Chưa chụp', value: 0 },
    ];
    public static readonly FILTER_STATES_2 = [
        { label: 'Tất cả', value: 10 },
        { label: 'Đã đọc', value: 1 },
        { label: 'Chưa đọc', value: 0 },
    ];
    public static readonly FILTER_STATES_3 = [
        { label: 'Tất cả', value: 10 },
        { label: 'Đã duyệt', value: 1 },
        { label: 'Chưa duyệt', value: 0 },
    ];
    public static readonly FILTER_STATES_4 = [
        { label: 'Tất cả', value: 10 },
        { label: 'Đã in', value: 1 },
        { label: 'Chưa in', value: 0 },
    ];
    public static readonly SHARED_PERIODS = [
        { label: '4 tiếng', value: 4 },
        { label: '8 tiếng', value: 8 },
        { label: '1 ngày', value: 24 },
        { label: '2 ngày', value: 48 },
        { label: '3 ngày', value: 72 },
        { label: '1 tuần', value: 168 },
        { label: '2 tuần', value: 336 },
        { label: '3 tuần', value: 504 },
        { label: '1 tháng', value: 720 },
        { label: 'Vô thời hạn', value: -1 },
    ];
    public static readonly APPOINTMENT_STATUS = [
        { label: 'Chờ xác nhận', value: 1 },
        { label: 'Đang xử lý', value: 2 },
        { label: 'KH đã xác nhận', value: 3 },
        { label: 'KH tắt máy', value: 4 },
        { label: 'Đổ chuông chưa nghe máy', value: 5 },
        { label: 'KH đang bận', value: 6 },
        { label: 'Chờ KH kiểm tra thông tin', value: 7 },
        { label: 'Chờ NV kiểm tra thông tin', value: 8 },
        { label: 'KH hủy lịch hẹn', value: 9 },
        { label: 'KH đã đến', value: 10 },
    ];

    public static readonly BANNERS_TYPE = [
        { label: 'Box khuyến mại', value: 1 },
    ];

    public static readonly BANNERS_ISDISABLEA = [
        { label: 'Disabled', value: false },
        { label: 'Enable', value: true },
    ];


    public static readonly APPOINTMENT_PRIORITY = [
        { label: 'Not set', value: 0 },
        { label: 'Cao', value: 1 },
        { label: 'Trung bình', value: 2 },
        { label: 'Thấp', value: 3 },
    ];
    public static readonly REPORT_EDITING_STATES = {
        READING: 1,
        APPROVING: 3,
    };
    public static readonly LABEL_STATUS = [
        { label: 'Chưa gán nhãn', value: 0 },
        { label: 'Đã gán nhãn', value: 1 },
        { label: 'Đã gán nhãn 1', value: 2 },
        { label: 'Đã gán nhãn 2', value: 3 },
        { label: 'Không duyệt nhãn', value: 4 },
        { label: 'Đã duyệt nhãn', value: 5 },
    ];

    public static readonly TIME_RANGE_FILTER = [
        { label: 'Hôm nay', value: '1' },
        { label: '3 ngày trước', value: '3' },
        { label: '7 ngày trước', value: '7' },
        { label: 'Tháng này', value: '10' },
    ];

    public static readonly HISTORY_LOG = [
        { label: 'Tất cả', value: null },
        { label: 'Ca khám', value: 1 },
        { label: 'Nhận chỉ định', value: 6 },
        { label: 'Thêm ca thăm khám', value: 11 },
        { label: 'Cập nhật ca thăm khám', value: 12 },
        { label: 'Đọc kết quả', value: 41 },
        { label: 'Duyệt kết quả', value: 42 },
        { label: 'Tải lên Key Image', value: 31 },
        { label: 'Tạo Key Image', value: 32 },
        { label: 'Tự động tải lên', value: 5 },
        { label: 'Key image', value: 3 },
        { label: 'Thêm báo cáo', value: 4 },
        { label: 'Tạo key image', value: 33 },
    ];


    public static readonly VALUE_FILTERS = [
        { label: 'Tên bệnh nhân', value: 'patientName', type: Constants.FILTER_TYPES.STRING, values: [] },
        { label: 'Mã bệnh nhân', value: 'patientCode', type: Constants.FILTER_TYPES.STRING, values: [] },
        { label: 'Mã bệnh phẩm', value: 'specimensCode', type: Constants.FILTER_TYPES.STRING, values: [] },
        { label: 'Loại yêu cầu', value: 'requestType', type: Constants.FILTER_TYPES.DROPDOWN, values: Constants.REQUEST_TYPES },
        { label: 'Trạng thái', value: 'status', type: Constants.FILTER_TYPES.DROPDOWN, values: Constants.REPORT_STATES },
        { label: 'Thời gian tạo', value: 'from', type: Constants.FILTER_TYPES.DROPDOWN, values: Constants.TIME_RANGE_FILTER },
        { label: 'Kết luận', value: 'conclusion', type: Constants.FILTER_TYPES.STRING, values: [] },
        { label: 'Chẩn đoán', value: 'diagnose', type: Constants.FILTER_TYPES.STRING, values: [] },
        { label: 'Đã chụp', value: 'hasSlide', type: Constants.FILTER_TYPES.DROPDOWN, values: Constants.FILTER_STATES_1 },
        { label: 'Đã đọc', value: 'hasConclusion', type: Constants.FILTER_TYPES.DROPDOWN, values: Constants.FILTER_STATES_2 },
        { label: 'Đã duyệt', value: 'isApprove', type: Constants.FILTER_TYPES.DROPDOWN, values: Constants.FILTER_STATES_3 },
        { label: 'Đã in', value: 'isPrint', type: Constants.FILTER_TYPES.DROPDOWN, values: Constants.FILTER_STATES_4 },
    ];

    public static readonly VALUE_SORTS = [
        { label: 'Tên bệnh nhân', value: 'PatientsName', sortField: 'PatientsName' },
        { label: 'Mã bệnh nhân', value: 'PatientCode', sortField: 'PatientCode' },
        { label: 'Mã bệnh phẩm', value: 'SpecimensCode', sortField: 'SpecimensCode' },
        { label: 'Loại yêu cầu', value: 'RequestTypeLabel', sortField: 'RequestTypeLabel' },
        { label: 'Số lam kính', field: 'slideCount', value: 'SlideCount', header: 'Số lam kính', sort: 'none', width: '8.5rem', sortField: 'SlideCount' },
        { label: 'Vị trí lấy mẫu', field: 'bodyPart', value: 'BodyPart', header: 'Vị trí lấy mẫu', sort: 'none', width: '10rem', sortField: 'BodyPart' },
        { label: 'Nơi gửi mẫu', field: 'sourceHospital', value: 'SourceHospital', header: 'Nơi gửi mẫu', sort: 'none', width: '15rem', sortField: 'SourceHospital' },
        { label: 'Thời gian tạo', value: 'CreatedTime', sortField: '' },
        { label: 'Kết luận', value: 'Conclusion', sortField: 'Conclusion' },
        { label: 'Chẩn đoán', value: 'Diagnose', sortField: 'ClinicalDiagnosis' },
    ];

    public static readonly VALUE_OPERATION = [
        { label: 'OR', value: 1 },
        { label: 'AND', value: 2 },
    ];

    public static readonly SESSION = [
        { label: 'Sáng', value: 1 },
        { label: 'Chiều', value: 2 },
    ]
    public  static readonly STATUS_TRAININGPERIOD = [
        { label: 'Mới tạo', value: 0},
        { label: 'Đã gửi đơn', value: 1},
        { label: 'Đang thực hiện', value: 2},
        { label: 'Đã thực hiện', value: 3},
        { label: 'Đã hủy', value: 4}
    ]
    public  static readonly TYPE_SUBJECT = [
        { label: 'Lý thuyết', value: 1},
        { label: 'Thực hành', value: 2},
    ]

    public  static readonly STATUS_VEHICLE = [
        { label: 'Chưa ký hợp đồng ', value: 0},
        { label: 'Đang hoạt động ', value: 1},
        { label: 'Dừng hoạt động ', value: 2},
    ]

    public  static readonly STATUS_BOOKING_HOTEL = [
      { label: 'Mới tạo, chưa xử lý', value: 0},
      { label: 'Đã xử lý', value: 1},
      { label: 'Từ chối', value: 2},
  ]
}

export class StorageKeys {
    public static readonly TOKEN = 'token';
    public static readonly USER = 'user';
    public static readonly ADMIN_DASHBOARD = 'admin';
    public static readonly LOGIN_FAIL = 'Incorrect username and/or password.';
}

export class Roles {
    public static readonly ADMIN = 1;
    public static readonly USER_MANAGE = 2;
    public static readonly GROUP_MANAGE = 3;
    public static readonly CUSTOMER = 100;
}

