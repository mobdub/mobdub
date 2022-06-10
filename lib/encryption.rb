require 'base64'
require 'openssl'

module Encryption
  def self.encrypt(text, key, iv=nil)
    return nil if text.blank? || key.nil?
    
    crypto = OpenSSL::Cipher::Cipher.new 'des3'
    crypto.encrypt

    crypto.key = key.ljust(24)
    crypto.iv = iv if iv

    output = crypto.update(text) << crypto.final
    Base64.encode64(output)
  end

  def self.decrypt(text, key, iv=nil)
    return nil if text.blank? || key.nil?
    base64_text = text.gsub(' ', '+')

    crypto = OpenSSL::Cipher::Cipher.new 'des3'
    crypto.decrypt

    crypto.key = key.ljust(24)
    crypto.iv = iv if iv

    decoded_text = Base64.decode64(base64_text)
    crypto.update(decoded_text) << crypto.final
  end
end
