/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DsCartBadgeDTO {
  count?: number;
  request_id?: number;
}

export interface DsCreateStrategyRequest {
  base_recovery_hours: number;
  description: string;
  title: string;
}

export interface DsLoginResponse {
  token?: string;
  user?: DsUserDTO;
}

export interface DsRequestDTO {
  calculated_recovery_time_hours?: number;
  created_at?: string;
  creator_username?: string;
  documentation_quality?: string;
  id?: number;
  it_skill_level?: string;
  moderator_username?: string;
  network_bandwidth_mbps?: number;
  status?: string;
  strategies?: DsStrategyDTO[];
}

export interface DsResolveRequest {
  /** "complete" or "reject" */
  action: string;
}

export interface DsStrategyDTO {
  base_recovery_hours?: number;
  description?: string;
  id?: number;
  image_url?: string;
  title?: string;
}

export interface DsUpdateRequestDetailsRequest {
  documentation_quality?: string;
  it_skill_level?: string;
  network_bandwidth_mbps?: number;
}

export interface DsUpdateRequestStrategyRequest {
  data_to_recover_gb: number;
}

export interface DsUpdateStrategyRequest {
  base_recovery_hours?: number;
  description?: string;
  title?: string;
}

export interface DsUpdateUserRequest {
  password?: string;
  username?: string;
}

export interface DsUserDTO {
  email?: string;
  id?: number;
  is_moderator?: boolean;
  username?: string;
}

export interface DsUserLoginRequest {
  password: string;
  username: string;
}

export interface DsUserRegisterRequest {
  password: string;
  username: string;
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title API Системы восстановления
 * @version 1.0
 * @contact API Support <support@recovery-api.com>
 *
 * API-сервер для управления заявками и стратегиями восстановления данных.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * @description Получение JWT токена по логину и паролю для доступа к защищенным эндпоинтам.
     *
     * @tags authorization
     * @name LoginCreate
     * @summary Аутентификация пользователя (гость)
     * @request POST:/auth/login
     */
    loginCreate: (credentials: DsUserLoginRequest, params: RequestParams = {}) =>
      this.request<DsLoginResponse, Record<string, string>>({
        path: `/auth/login`,
        method: "POST",
        body: credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет текущий JWT токен в черный список, делая его недействительным.
     *
     * @tags authorization
     * @name LogoutCreate
     * @summary Выход из системы (авторизованные пользователи)
     * @request POST:/auth/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  recoveryRequests = {
    /**
     * @description Возвращает список заявок. Для модератора - все, для пользователя - только его.
     *
     * @tags requests
     * @name RecoveryRequestsList
     * @summary Получить список заявок (авторизованные пользователи)
     * @request GET:/recovery_requests
     * @secure
     */
    recoveryRequestsList: (
      query?: {
        /** Фильтр по статусу заявки (formed, completed, rejected) */
        status?: string;
        /** Фильтр по дате 'от' (формат YYYY-MM-DD) */
        from?: string;
        /** Фильтр по дате 'до' (формат YYYY-MM-DD) */
        to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsRequestDTO[], Record<string, string>>({
        path: `/recovery_requests`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает ID черновика текущего пользователя и количество стратегий в нем.
     *
     * @tags requests
     * @name CartList
     * @summary Получить информацию для иконки корзины (авторизованные пользователи)
     * @request GET:/recovery_requests/cart
     * @secure
     */
    cartList: (params: RequestParams = {}) =>
      this.request<DsCartBadgeDTO, Record<string, string>>({
        path: `/recovery_requests/cart`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Находит или создает черновик заявки для текущего пользователя и добавляет в него стратегию.
     *
     * @tags strategies
     * @name DraftStrategiesCreate
     * @summary Добавить стратегию в черновик заявки (авторизованные пользователи)
     * @request POST:/recovery_requests/draft/strategies/{strategy_id}
     * @secure
     */
    draftStrategiesCreate: (strategyId: number, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/recovery_requests/draft/strategies/${strategyId}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Возвращает полную информацию о заявке, включая привязанные стратегии.
     *
     * @tags requests
     * @name RecoveryRequestsDetail
     * @summary Получить одну заявку по ID (авторизованные пользователи)
     * @request GET:/recovery_requests/{id}
     * @secure
     */
    recoveryRequestsDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsRequestDTO, Record<string, string>>({
        path: `/recovery_requests/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Позволяет пользователю обновить поля своей заявки (уровень навыков, пропускная способность сети и т.д.).
     *
     * @tags requests
     * @name RecoveryRequestsUpdate
     * @summary Обновить детали заявки (авторизованные пользователи)
     * @request PUT:/recovery_requests/{id}
     * @secure
     */
    recoveryRequestsUpdate: (id: number, updateData: DsUpdateRequestDetailsRequest, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/recovery_requests/${id}`,
        method: "PUT",
        body: updateData,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Логически удаляет заявку, переводя ее в статус "удалена". Доступно только для создателя и только для черновиков.
     *
     * @tags requests
     * @name RecoveryRequestsDelete
     * @summary Удалить заявку (черновик) (авторизованные пользователи)
     * @request DELETE:/recovery_requests/{id}
     * @secure
     */
    recoveryRequestsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/recovery_requests/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Переводит заявку из статуса "черновик" в "сформирована".
     *
     * @tags requests
     * @name FormUpdate
     * @summary Сформировать заявку (авторизованные пользователи)
     * @request PUT:/recovery_requests/{id}/form
     * @secure
     */
    formUpdate: (id: number, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/recovery_requests/${id}/form`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * @description Модератор завершает (с расчетом) или отклоняет заявку.
     *
     * @tags requests
     * @name ResolveUpdate
     * @summary Завершить или отклонить заявку (модератор)
     * @request PUT:/recovery_requests/{id}/resolve
     * @secure
     */
    resolveUpdate: (id: number, action: DsResolveRequest, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/recovery_requests/${id}/resolve`,
        method: "PUT",
        body: action,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Изменяет дополнительные данные (например, объем данных) для конкретной стратегии в рамках одной заявки.
     *
     * @tags m-m
     * @name StrategiesUpdate
     * @summary Обновить данные стратегии в заявке (авторизованные пользователи)
     * @request PUT:/recovery_requests/{id}/strategies/{strategy_id}
     * @secure
     */
    strategiesUpdate: (
      id: number,
      strategyId: number,
      updateData: DsUpdateRequestStrategyRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, Record<string, string>>({
        path: `/recovery_requests/${id}/strategies/${strategyId}`,
        method: "PUT",
        body: updateData,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Удаляет связь между заявкой и стратегией.
     *
     * @tags m-m
     * @name StrategiesDelete
     * @summary Удалить стратегию из заявки (авторизованные пользователи)
     * @request DELETE:/recovery_requests/{id}/strategies/{strategy_id}
     * @secure
     */
    strategiesDelete: (id: number, strategyId: number, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/recovery_requests/${id}/strategies/${strategyId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  strategies = {
    /**
     * @description Возвращает список всех активных стратегий с возможностью фильтрации по названию.
     *
     * @tags strategies
     * @name StrategiesList
     * @summary Получить список стратегий (все)
     * @request GET:/strategies
     */
    strategiesList: (
      query?: {
        /** Фильтр по названию стратегии */
        title?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsStrategyDTO[], Record<string, string>>({
        path: `/strategies`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает новую запись о стратегии восстановления. Доступно только для модераторов.
     *
     * @tags strategies
     * @name StrategiesCreate
     * @summary Создать новую стратегию (модератор)
     * @request POST:/strategies
     * @secure
     */
    strategiesCreate: (strategy: DsCreateStrategyRequest, params: RequestParams = {}) =>
      this.request<DsStrategyDTO, Record<string, string>>({
        path: `/strategies`,
        method: "POST",
        body: strategy,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает детальную информацию о конкретной стратегии.
     *
     * @tags strategies
     * @name StrategiesDetail
     * @summary Получить одну стратегию по ID (все)
     * @request GET:/strategies/{id}
     */
    strategiesDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsStrategyDTO, Record<string, string>>({
        path: `/strategies/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет информацию о существующей стратегии.
     *
     * @tags strategies
     * @name StrategiesUpdate
     * @summary Обновить стратегию (модератор)
     * @request PUT:/strategies/{id}
     * @secure
     */
    strategiesUpdate: (id: number, updateData: DsUpdateStrategyRequest, params: RequestParams = {}) =>
      this.request<DsStrategyDTO, Record<string, string>>({
        path: `/strategies/${id}`,
        method: "PUT",
        body: updateData,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет стратегию из системы.
     *
     * @tags strategies
     * @name StrategiesDelete
     * @summary Удалить стратегию (модератор)
     * @request DELETE:/strategies/{id}
     * @secure
     */
    strategiesDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/strategies/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Загружает и привязывает изображение к стратегии.
     *
     * @tags strategies
     * @name ImageCreate
     * @summary Загрузить изображение для стратегии (модератор)
     * @request POST:/strategies/{id}/image
     * @secure
     */
    imageCreate: (
      id: number,
      data: {
        /** Файл изображения */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/strategies/${id}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Создает нового пользователя в системе. По умолчанию роль "пользователь", не "модератор".
     *
     * @tags authorization
     * @name UsersCreate
     * @summary Регистрация нового пользователя (гость)
     * @request POST:/users
     */
    usersCreate: (credentials: DsUserRegisterRequest, params: RequestParams = {}) =>
      this.request<DsUserDTO, Record<string, string>>({
        path: `/users`,
        method: "POST",
        body: credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию о пользователе, чей токен используется для запроса.
     *
     * @tags users
     * @name GetUsers
     * @summary Получить данные текущего пользователя (авторизованные пользователи)
     * @request GET:/users/me
     * @secure
     */
    getUsers: (params: RequestParams = {}) =>
      this.request<DsUserDTO, Record<string, string>>({
        path: `/users/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Позволяет авторизованному пользователю обновить свой логин или пароль.
     *
     * @tags users
     * @name PutUsers
     * @summary Обновить данные текущего пользователя (авторизованные пользователи)
     * @request PUT:/users/me
     * @secure
     */
    putUsers: (updateData: DsUpdateUserRequest, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/users/me`,
        method: "PUT",
        body: updateData,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
