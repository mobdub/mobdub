require 'test_helper'

class SmilTextsControllerTest < ActionController::TestCase
  def test_should_get_index
    get :index
    assert_response :success
    assert_not_nil assigns(:smil_texts)
  end

  def test_should_get_new
    get :new
    assert_response :success
  end

  def test_should_create_smil_text
    assert_difference('SmilText.count') do
      post :create, :smil_text => { }
    end

    assert_redirected_to smil_text_path(assigns(:smil_text))
  end

  def test_should_show_smil_text
    get :show, :id => smil_texts(:one).id
    assert_response :success
  end

  def test_should_get_edit
    get :edit, :id => smil_texts(:one).id
    assert_response :success
  end

  def test_should_update_smil_text
    put :update, :id => smil_texts(:one).id, :smil_text => { }
    assert_redirected_to smil_text_path(assigns(:smil_text))
  end

  def test_should_destroy_smil_text
    assert_difference('SmilText.count', -1) do
      delete :destroy, :id => smil_texts(:one).id
    end

    assert_redirected_to smil_texts_path
  end
end
