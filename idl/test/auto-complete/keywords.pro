pro keywords
  compile_opt idl3

  ; keywords and variables
  a = fft()

  ; force binary keywords
  b = fft(/)

  ; dont send keywords that match our "/te"
  p = plot(/te,)

  ; only send keywords if we have a keyword
  p = plot(/d)

  ; dont abbreviate keywords when auto complete
  e = envi(/la)
end