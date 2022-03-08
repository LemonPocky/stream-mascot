using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// Class that handles the appearance and behavior of the Mascot
public class Mascot : MonoBehaviour
{

  public Animator animator;

  // Start is called before the first frame update
  void Start()
  {

  }

  // Update is called once per frame
  void Update()
  {
    if (Input.GetKey(KeyCode.J))
    {
      animator.SetBool("keyPress", true);
    }
    else
    {
      animator.SetBool("keyPress", false);
    }
  }
}
