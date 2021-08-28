package net.jewelchat;

import android.app.NotificationManager;
import android.content.Context;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "JewelChat";
  }

  @Override
  protected void onStart() {
    super.onStart();
    resetBadgeCounterOfPushMessages();
  }

  private void resetBadgeCounterOfPushMessages() {
    NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
      if (notificationManager != null) {
        notificationManager.cancelAll();
      }
    }
  }

}
