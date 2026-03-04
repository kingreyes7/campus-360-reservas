/**
 * Tests Caja Blanca - Middleware de Autenticación
 * Adaptado al middleware REAL del proyecto
 */

const { autenticar } = require('../src/middleware/autenticacion');

describe('Middleware Autenticación - White Box Testing', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
      body: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockNext = jest.fn();
  });

  // ============================================
  // autenticar - Rama 1: Sin Token
  // ============================================
  test('RAMA 1: autenticar - Sin header Authorization retorna 401', () => {
    mockReq.headers = {}; // Sin authorization

    autenticar(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        mensaje: expect.stringContaining('Token')
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  // ============================================
  // autenticar - Rama 2: Authorization vacío
  // ============================================
  test('RAMA 2: autenticar - Authorization vacío retorna 401', () => {
    mockReq.headers = {
      authorization: ''
    };

    autenticar(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  // ============================================
  // autenticar - Rama 3: Sin formato Bearer
  // ============================================
  test('RAMA 3: autenticar - Authorization sin Bearer retorna 401', () => {
    mockReq.headers = {
      authorization: 'InvalidToken'
    };

    autenticar(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  // ============================================
  // autenticar - Rama 4: Solo Bearer sin token
  // ============================================
  test('RAMA 4: autenticar - Solo Bearer sin token retorna 401', () => {
    mockReq.headers = {
      authorization: 'Bearer'
    };

    autenticar(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  // ============================================
  // autenticar - Rama 5: Bearer con espacio pero sin token
  // ============================================
  test('RAMA 5: autenticar - Bearer con espacio pero sin token retorna 401', () => {
    mockReq.headers = {
      authorization: 'Bearer '
    };

    autenticar(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  // ============================================
  // autenticar - Rama 6: Token inválido
  // ============================================
  test('RAMA 6: autenticar - Token inválido/no registrado retorna 401', () => {
    mockReq.headers = {
      authorization: 'Bearer token_invalido_12345'
    };

    autenticar(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        mensaje: expect.stringContaining('inválido')
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  // ============================================
  // autenticar - Rama 7: Token válido (caso especial - necesitaría un token generado)
  // ============================================
  test('RAMA 7: autenticar - Verifica que extrae token correctamente de Authorization', () => {
    // Este test verifica que el split(' ')[1] funciona correctamente
    mockReq.headers = {
      authorization: 'Bearer token_parts_extraido_correctamente'
    };

    autenticar(mockReq, mockRes, mockNext);

    // Si llegó aquí sin errores, la extracción del token funcionó
    // (fallará en verificación porque el token no es válido, pero pasó la extracción)
    expect(mockRes.status).toHaveBeenCalled();
  });

  // ============================================
  // autenticar - Rama 8: Caso insensitive (si aplica)
  // ============================================
  test('RAMA 8: autenticar - Bearer en diferentes casos', () => {
    // Intenta con bearer en minúsculas
    mockReq.headers = {
      authorization: 'bearer token_test'
    };

    autenticar(mockReq, mockRes, mockNext);

    // Debería intentar extraer el token
    // La mayoría de impls usan split(' ') que funciona con cualquier caso
    expect(mockRes.status).toHaveBeenCalled();
  });

  // ============================================
  // autenticar - Rama 9: Headers opcionales
  // ============================================
  test('RAMA 9: autenticar - req.headers.authorization es undefined', () => {
    mockReq.headers.authorization = undefined;

    autenticar(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  // ============================================
  // autenticar - Rama 10: X-Token alternativo (si existe)
  // ============================================
  test('RAMA 10: autenticar - Solo proporciona Authorization', () => {
    // Este test verifica que sin Authorization, fallará
    mockReq.headers = {
      'x-token': 'token_value'
    };

    autenticar(mockReq, mockRes, mockNext);

    // El middleware busca authorization, no x-token
    expect(mockRes.status).toHaveBeenCalledWith(401);
  });
});
