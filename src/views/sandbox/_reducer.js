import * as TYPES from './_types';

const initialState = {
  loaded: false,
  types: []
};

const sandboxReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case TYPES.FETCH_SANDBOX_TYPES_SUCCESS:
      return {
        ...state,
        loaded: true,
        types: payload.types
      };

    case TYPES.CREATE_SANDBOX_TYPE_SUCCESS:
      return {
        ...state,
        types: [...state.types, { ...payload.type, instances: [] }]
      };

    case TYPES.FETCH_SANDBOX_TYPES_ERROR:
      return {
        ...state,
        loaded: true
      };

    case TYPES.DELETE_SANDBOX_TYPE_SUCCESS:
      return {
        ...state,
        types: state.types.filter(type => type.id !== payload.typeId)
      };

    case TYPES.EDIT_SANDBOX_TYPE_SUCCESS:
      return {
        ...state,
        types: state.types.map(type =>
          type.id === payload.type.id ? { ...payload.type, instances: [...type.instances] } : type
        )
      };

    case TYPES.CREATE_SANDBOX_INSTANCE_SUCCESS:
      return {
        ...state,
        types: state.types.map(type =>
          type.id === payload.instance.type_id
            ? { ...type, instances: [...type.instances, payload.instance] }
            : type
        )
      };

    case TYPES.EDIT_SANDBOX_INSTANCE_SUCCESS:
      return {
        ...state,
        types: state.types.map(type =>
          type.id === payload.instance.type_id
            ? {
                ...type,
                instances: type.instances.map(instance =>
                  instance.id === payload.instance.id ? payload.instance : instance
                )
              }
            : type
        )
      };

    case TYPES.DELETE_SANDBOX_INSTANCE_SUCCESS:
      return {
        ...state,
        types: state.types.map(type =>
          type.id === payload.typeId
            ? {
                ...type,
                instances: type.instances.filter(instance => instance.id !== payload.instanceId)
              }
            : type
        )
      };

    default:
      return state;
  }
};

export default sandboxReducer;
